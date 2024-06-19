import {Application} from "express";
import {MongoClient, ObjectId, WithId} from "mongodb";
import {
  BreederProfile,
  ClientHeat,
  DatabaseDog,
  DatabaseDogEvent,
  RawHeatFields,
  EVENT_TYPE,
  KennelProfile,
  RawHeatData,
} from "../../types";
import {
  errorHandler,
  getCookiesPayload,
  getTimestamp,
  insertEntity,
  modifyNestedArrayFieldById,
  updateBaseHeatInfoById,
  verifyProfileType,
  shiftDatesWithTimezone,
} from "../../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../../constants";
import {CustomError, ERROR_NAME} from "../../methods/error_messages_methods";

type PrepareNewHeatProps = Pick<RawHeatData, 'profileId' | 'comments' | 'dogId' | 'eventType'> & {
  client: MongoClient,
}

type PrepareNewHeat = Omit<DatabaseDogEvent, 'date' | 'activated' | 'eventType'> & {
  eventType: EVENT_TYPE.HEAT
}

const prepareToNewHeatInsert = ({client, profileId, comments, dogId, eventType}: PrepareNewHeatProps) => {
  const heat: PrepareNewHeat = {
    profileId: new ObjectId(profileId),
    comments,
    eventType,
    dogId: new ObjectId(dogId),
    validity: null,
    medication: null,
    documentId: null,
    diagnosticsType: null,
    vet: null,
    partnerId: null,
    litterId: null,
  }

  return async ({date, activated}: {date: string[], activated: boolean}): Promise<{ heat: ClientHeat, heatInsertedId: ObjectId }> => {
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

    return {
      heat: {
        comments: heat.comments,
        date,
        activated,
        profileId: heat.profileId,
        dogId: heat.dogId,
        eventType: heat.eventType,
      },
      heatInsertedId
    };
  }
}

export const initHeatRoutes = (app: Application, client: MongoClient) => {
  app.post<{}, {message: string, newEvents: WithId<ClientHeat>[]}, Omit<RawHeatData, 'activated' | 'profileId'> & {repeat: true, frequencyInDays: number}, {}>('/api/heat', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /POST/HEAT, profileId >>> ', profileId)
      await verifyProfileType(client, profileId)

      // при создании течки мы не можем добавить к ней событие вязки, потому что вязка происходит после начала течки
      const { date, comments, dogId, repeat, frequencyInDays, eventType } = req.body;

      if (!date || !dogId) throw new CustomError(ERROR_NAME.INCOMPLETE_INCOMING_DATA, {file: 'heat_routes', line: 84})

      const addNewHeat = prepareToNewHeatInsert({client, profileId, comments, dogId, eventType})

      const activated = new Date(date[0]) < new Date()

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

  app.put<{}, {}, {baseHeatInfo: Pick<DatabaseDogEvent, RawHeatFields>}, {id: string}>('/api/heat', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /PUT/HEAT, profileId >>> ', profileId)
      const {baseHeatInfo} = req.body;
      const { id } = req.query;

      await updateBaseHeatInfoById(client, new ObjectId(id), baseHeatInfo)

      res.status(200).send({message: 'Base heat info was updated successfully!'})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })
}
