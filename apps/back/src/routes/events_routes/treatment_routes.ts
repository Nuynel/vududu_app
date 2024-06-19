import {Application} from "express";
import {MongoClient, ObjectId, WithId} from "mongodb";
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc';
import {
  DatabaseDogEvent,
  RawTreatmentFields,
  RawAntiparasiticTreatmentData,
  ClientAntiparasiticTreatment,
  RawVaccinationData,
  ClientVaccination,
  EVENT_TYPE,
  DatabaseDog,
  KennelProfile,
  BreederProfile,
} from "../../types";
import {
  errorHandler,
  getCookiesPayload, getTimestamp,
  insertEntity,
  modifyNestedArrayFieldById, updateBaseTreatmentInfoById,
  verifyProfileType,
  shiftDatesWithTimezone,
} from "../../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../../constants";
import {CustomError, ERROR_NAME} from "../../methods/error_messages_methods";

dayjs.extend(utc);
dayjs.extend(timezone);

// todo у меня планируется только следующее событие, а хорошо бы лпанировать череду повторяющихся через промежуток событий

type PrepareNewTreatmentProps = Pick<
  | RawAntiparasiticTreatmentData | RawVaccinationData,
  | 'profileId' | 'comments' | 'dogId' | 'eventType'
> & { client: MongoClient }

type PrepareNewTreatment = Omit<DatabaseDogEvent, 'date' | 'activated' | 'eventType' | 'validity' | 'medication'> & {
  eventType: EVENT_TYPE.ANTIPARASITIC_TREATMENT | EVENT_TYPE.VACCINATION
}

type PostTreatmentReq = Omit<RawAntiparasiticTreatmentData, 'profileId' | 'activated'> & {
  repeat: boolean
  frequencyInDays: number
}

type PostTreatmentRes = {
  message: string
  newEvents: (WithId<ClientAntiparasiticTreatment> | WithId<ClientVaccination>)[]
}

const prepareToNewTreatmentInsert = ({client, profileId, comments, dogId, eventType}: PrepareNewTreatmentProps) => {
  const treatment: PrepareNewTreatment = {
    profileId: new ObjectId(profileId),
    comments,
    eventType,
    dogId: new ObjectId(dogId),
    documentId: null,
    diagnosticsType: null,
    vet: null,
    partnerId: null,
    litterId: null,
  }

  return async (
    {date, validity, medication, activated}: Pick<RawAntiparasiticTreatmentData | RawVaccinationData, 'date' | 'validity' | 'medication' | 'activated'>
  ): Promise<{ treatment: ClientAntiparasiticTreatment | ClientVaccination, treatmentInsertedId: ObjectId }> => {
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
  app.post<{}, PostTreatmentRes, PostTreatmentReq, {}>('/api/treatment', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /POST/TREATMENT, profileId >>> ', profileId)
      await verifyProfileType(client, profileId)

      const { date, comments, validity, medication, dogId, repeat, frequencyInDays, eventType } = req.body;

      if (!date || !dogId) throw new CustomError(ERROR_NAME.INCOMPLETE_INCOMING_DATA, {file: 'heat_routes', line: 84})

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
        date: shiftDatesWithTimezone(date, frequencyInDays),
        medication: null,
        validity: null,
        activated: false
      })

      return res.send({
        message: 'Антипаразитарная обработка добавлена!',
        newEvents: [
          { ...treatment, _id: treatmentInsertedId },
          {...nextTreatment, _id: nextTreatmentInsertedId }
        ]
      })
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.put<{}, {}, {baseTreatmentInfo: Pick<DatabaseDogEvent, RawTreatmentFields>}, {id: string}>('/api/treatment', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /PUT/TREATMENT, profileId >>> ', profileId)
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

