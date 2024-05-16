import {Application} from "express";
import {MongoClient, ObjectId} from "mongodb";
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc';
import {
  AntiparasiticTreatment,
  EVENT_TYPE,
  DatabaseDog,
  KennelProfile,
  BreederProfile, Vaccination,
} from "../../types";
import {
  errorHandler,
  getCookiesPayload,
  insertEntity,
  modifyNestedArrayFieldById, updateBaseTreatmentInfoById,
  verifyProfileType
} from "../../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../../constants";

// todo выпилить moment и добавить https://day.js.org/docs/en/installation/installation

dayjs.extend(utc);
dayjs.extend(timezone);

export function shiftDatesWithTimezone(dateString: string, days: number): string {
  // TODO не работает нормально с таймзонами
  // Создание объекта dayjs с учётом временной зоны из исходной строки
  const date = dayjs.tz(dateString);
  // Добавление дней
  const shiftedDate = date.add(days, 'day');
  // Возвращение изменённой даты в исходном формате
  return shiftedDate.format();
}

type PrepareNewTreatmentProps = {
  client: MongoClient,
  profileId: string,
  comments: string,
  dogId: string,
  eventType: EVENT_TYPE.ANTIPARASITIC_TREATMENT | EVENT_TYPE.VACCINATION,
}

type TreatmentSample = Omit<AntiparasiticTreatment, 'date' | 'validity' | 'medication' | 'activated'>
 | Omit<Vaccination, 'date' | 'validity' | 'medication' | 'activated'>

// type test = (Pick<AntiparasiticTreatment, 'date' | 'validity' | 'medication' | 'activated'>) => Promise<>

const prepareToNewTreatmentInsert = ({client, profileId, comments, dogId, eventType}: PrepareNewTreatmentProps) => {
  const treatment: TreatmentSample = {
    profileId: new ObjectId(profileId),
    comments,
    dogId: new ObjectId(dogId),
    eventType,
  }

  return async ({date, validity, medication, activated}: Pick<AntiparasiticTreatment, 'date' | 'validity' | 'medication' | 'activated'>) => {
    const { insertedId: treatmentInsertedId } = await insertEntity(
      client,
      COLLECTIONS.EVENTS,
      {...treatment, date, validity, medication, activated}
    )

    await modifyNestedArrayFieldById<DatabaseDog>(
      client,
      COLLECTIONS.DOGS,
      treatment.dogId,
      treatmentInsertedId,
      FIELDS_NAMES.TREATMENT_IDS,
    )
    await modifyNestedArrayFieldById<KennelProfile | BreederProfile>(
      client,
      COLLECTIONS.PROFILES,
      treatment.profileId,
      treatmentInsertedId,
      FIELDS_NAMES.EVENT_IDS,
    )

    return { treatment: {...treatment, date, validity, medication, activated}, treatmentInsertedId };
  }
}

export const initTreatmentRoutes = (app: Application, client: MongoClient) => {
  app.post('/api/treatment', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      await verifyProfileType(client, profileId)

      const { date, comments, validity, medication, dogId, repeat, frequencyInDays, eventType } = req.body;

      const addNewTreatment = prepareToNewTreatmentInsert({client, profileId, comments, dogId, eventType})

      const activated = new Date(date[0]) < new Date()

      const { treatment, treatmentInsertedId } =
        await addNewTreatment({date, validity, medication, activated})

      if (!repeat) return res.send(
        { message: 'Антипаразитарная обработка добавлена!', newEvents: [{
            ...treatment,
            _id: treatmentInsertedId
          }] })

      const {
        treatment: nextTreatment,
        treatmentInsertedId: nextTreatmentInsertedId,
      } = await addNewTreatment({
        date: [shiftDatesWithTimezone(date[0], frequencyInDays)],
        medication: null,
        validity: null,
        activated: false
      })

      return res.send({
        message: 'Антипаразитарная обработка добавлена!',
        newEvents: [{
          ...treatment,
          _id: treatmentInsertedId
        },
          {
            ...nextTreatment,
            _id: nextTreatmentInsertedId
          }]
      })
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.put<
    {},
    {},
    {baseTreatmentInfo: Pick<AntiparasiticTreatment | Vaccination, 'comments' | 'date' | 'activated' | 'validity' | 'medication'>
    }, {id: string}>('/api/treatment', async (req, res) => {
    try {
      const {} = getCookiesPayload(req);
      const {baseTreatmentInfo} = req.body;
      const { id } = req.query;

      await updateBaseTreatmentInfoById(client, new ObjectId(id), baseTreatmentInfo)

      res.status(200).send({message: 'Base treatment info was updated successfully!'})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })
}

// ToDo: сделать редактирование и удаление антипаразиторной обработки с соответствующим изменением истории обработок

