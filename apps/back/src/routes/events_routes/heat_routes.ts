import {Application} from "express";
import {MongoClient, ObjectId} from "mongodb";
import dayjs from 'dayjs'
import {BreederProfile, DatabaseDog, DatabaseEvent, EVENT_TYPE, Heat, KennelProfile} from "../../types";
import {
  insertEntity,
  modifyNestedArrayFieldById,
  getCookiesPayload,
  verifyProfileType, errorHandler, getTimestamp,
  updateBaseHeatInfoById,
} from "../../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../../constants";

export function shiftDatesWithTimezone(dateStrings: string[], days: number): string[] {
  return dateStrings.map(dateString => {
    // Создание объекта dayjs с учётом временной зоны из исходной строки
    const date = dayjs.tz(dateString);
    // Добавление дней
    const shiftedDate = date.add(days, 'day');
    console.log('PREV => ', dateString, 'NEXT => ', shiftedDate.format())
    // Возвращение изменённой даты в исходном формате
    return shiftedDate.format();
  });
}

type PrepareNewHeatProps = {
  client: MongoClient,
  profileId: string,
  comments: string,
  dogId: string,
}

type BaseHeatInfo = {
  comments: string,
  date: string[],
  status: string,
}

const prepareToNewHeatInsert = ({client, profileId, comments, dogId}: PrepareNewHeatProps) => {
  const heat: Omit<Heat, 'date' | 'activated'> = {
    profileId: new ObjectId(profileId),
    comments,
    dogId: new ObjectId(dogId),
    connectedEvents: { mate: null },
    eventType: EVENT_TYPE.HEAT,
  }

  return async ({date, activated}: {date: string[], activated: boolean}) => {
    const { insertedId: heatInsertedId } = await insertEntity(client, COLLECTIONS.EVENTS, {...heat, date, activated})

    await modifyNestedArrayFieldById<DatabaseDog>(
      client,
      COLLECTIONS.DOGS,
      heat.dogId,
      heatInsertedId,
      FIELDS_NAMES.REPRODUCTIVE_HISTORY_HEAT_IDS,
    )
    await modifyNestedArrayFieldById<KennelProfile | BreederProfile>(
      client,
      COLLECTIONS.PROFILES,
      heat.profileId,
      heatInsertedId,
      FIELDS_NAMES.EVENT_IDS,
    )

    return { heat: {...heat, date, activated}, heatInsertedId };
  }
}

export const initHeatRoutes = (app: Application, client: MongoClient) => {
  app.post('/api/heat', async (req, res) => {
    console.log(getTimestamp, 'REQUEST TO /POST/HEAT')
    try {
      const {profileId} = getCookiesPayload(req)
      await verifyProfileType(client, profileId)

      // при создании течки мы не можем добавить к ней событие вязки, потому что вязка происходит после начала течки
      const { date, comments, dogId, repeat, frequencyInDays } = req.body;

      const addNewHeat = prepareToNewHeatInsert({client, profileId, comments, dogId})

      const activated = new Date(date) < new Date()

      const {heatInsertedId, heat} = await addNewHeat({date, activated})

      if (!repeat) return res.send({ message: 'Течка добавлена!', newEvents: [{...heat, _id: heatInsertedId}] })

      const {
        heat: nextHeat,
        heatInsertedId: nextHeatInsertedId,
      } = await addNewHeat({date: shiftDatesWithTimezone(date, frequencyInDays), activated: false})

      return res.send({
        message: 'Течка добавлена!',
        newEvents: [{...heat, _id: heatInsertedId}, {
          ...nextHeat,
          _id: nextHeatInsertedId
        }],
      })
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.put<{}, {}, {baseHeatInfo: Pick<DatabaseEvent, 'comments' | 'date' | 'activated'>}, {id: string}>('/api/heat', async (req, res) => {
    console.log(getTimestamp, 'REQUEST TO /PUT/HEAT')
    try {
      const {} = getCookiesPayload(req);
      const {baseHeatInfo} = req.body;
      const { id } = req.query;

      await updateBaseHeatInfoById(client, new ObjectId(id), baseHeatInfo)

      res.status(200).send({message: 'Base heat info was updated successfully!'})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })
}
