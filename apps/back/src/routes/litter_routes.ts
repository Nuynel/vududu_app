import {Application} from "express";
import {MongoClient, ObjectId, WithId} from "mongodb";
import {BreederProfile, DatabaseDog, KennelProfile, Litter, NewLitter} from "../types";
import {
  assignValueToField,
  constructLitterForClient,
  deleteEntityById,
  errorHandler,
  findEntityById,
  findLittersByDate,
  getCookiesPayload, getTimestamp,
  insertEntity,
  modifyNestedArrayField,
  modifyNestedArrayFieldById,
  updateBaseLitterInfoById,
  verifyProfileType
} from "../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";

// учти, что владелец кобеля не может добавлять помет!!! Это может делать только владелец суки
const isDogLinkedToProfile = (dog: WithId<DatabaseDog>, profileId: string) => {
  const dogProfileId = dog.profileId instanceof ObjectId ? dog.profileId.toHexString() : dog.profileId
  return dog.isLinkedToOwner && dogProfileId === profileId
}

const checkIsLitterLinkedToOwner = async (fatherId: string | ObjectId, motherId: string | ObjectId, profileId: string, client: MongoClient) => {
  const father = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(fatherId))
  const mother = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(motherId))
  if (!father || !mother) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'litter_routes', line: 30})
  return isDogLinkedToProfile(father, profileId) || isDogLinkedToProfile(mother, profileId)
}

export const initLitterRoutes = (app: Application, client: MongoClient) => {
  app.post('/api/litter', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /POST/LITTERS, profileId >>> ', profileId)
      await verifyProfileType(client, profileId)
      const newLitterData: NewLitter = { ...req.body }
      const isLinkedToOwner = await checkIsLitterLinkedToOwner(newLitterData.fatherId, newLitterData.motherId, profileId, client)
      const newLitter: Litter = { ...newLitterData, profileId: new ObjectId(profileId), isLinkedToOwner }
      const { insertedId: litterId } = await insertEntity(client, COLLECTIONS.LITTERS, newLitter)
      await modifyNestedArrayFieldById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(newLitterData.fatherId),
        litterId, FIELDS_NAMES.REPRODUCTIVE_HISTORY_LITTER_IDS)
      await modifyNestedArrayFieldById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(newLitterData.motherId),
        litterId, FIELDS_NAMES.REPRODUCTIVE_HISTORY_LITTER_IDS)
      await Promise.all(newLitterData.puppyIds.map(async (puppyId) => {
        await assignValueToField<DatabaseDog>(client, COLLECTIONS.DOGS, puppyId, FIELDS_NAMES.LITTER_ID, litterId)
      }))
      await modifyNestedArrayFieldById<KennelProfile | BreederProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId), litterId, FIELDS_NAMES.LITTER_IDS)
      const litter = await constructLitterForClient(client, { ...newLitter, _id: litterId })
      res.send({ litter })
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  });

  // ToDo поиск пометов для миксов!!!
  app.get<{}, { litters: Litter[] }, {}, { date: string }>('/api/litters', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/LITTERS, profileId >>> ', profileId)
      const { date } = req.query;
      const litters= await findLittersByDate(client, date);
      res.send({ litters })
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.put<{}, {}, {baseLitterInfo: {comments: string}}, {id: string}>('/api/litter', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /PUT/LITTER, profileId >>> ', profileId)
      const {baseLitterInfo} = req.body;
      const { id } = req.query;

      await updateBaseLitterInfoById(client, new ObjectId(id), baseLitterInfo)

      // ToDo если поменялась дата рождения - отвязать всех щенков
      res.status(200).send({message: 'Base litter info was updated successfully!'})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  // при удалении помета удалять его из историй пометов родителей, удалять из всех потомков
  // todo удалить все документы, связанные с пометом

  app.delete<{}, {}, {}, {id: string}>('/api/litter', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      const { id } = req.query;
      console.log(getTimestamp(), 'REQUEST TO /DELETE/LITTER, profileId >>> ', profileId, ' >>> litterId >>> ', id)

      const litter = await findEntityById<Litter>(client, COLLECTIONS.LITTERS, new ObjectId(id))
      if (!litter) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'litter_routes', line: 98})

      if (litter.fatherId) {
        const deleteResult = await modifyNestedArrayField<DatabaseDog>(
          client,
          COLLECTIONS.DOGS,
          new ObjectId(litter.fatherId),
          FIELDS_NAMES.ID,
          FIELDS_NAMES.REPRODUCTIVE_HISTORY_LITTER_IDS,
          new ObjectId(id),
          '$pull'
        )
        if (!deleteResult.modifiedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'litter_routes', line: 110})
      }

      if (litter.motherId) {
        const deleteResult = await modifyNestedArrayField<DatabaseDog>(
          client,
          COLLECTIONS.DOGS,
          new ObjectId(litter.motherId),
          FIELDS_NAMES.ID,
          FIELDS_NAMES.REPRODUCTIVE_HISTORY_LITTER_IDS,
          new ObjectId(id),
          '$pull'
        )
        if (!deleteResult.modifiedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'litter_routes', line: 123})
      }

      if (litter.puppyIds.length) {
        await Promise.all(litter.puppyIds.map(async (puppyId) => {
          const deleteResult = await modifyNestedArrayField<DatabaseDog>(
            client,
            COLLECTIONS.DOGS,
            puppyId,
            FIELDS_NAMES.ID,
            FIELDS_NAMES.LITTER_ID,
            null,
            '$set'
          )
          if (!deleteResult.modifiedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'litter_routes', line: 137})
        }))
      }

      if (litter.profileId) {
        const deleteResult = await modifyNestedArrayField<DatabaseDog>(
          client,
          COLLECTIONS.PROFILES,
          new ObjectId(litter.profileId),
          FIELDS_NAMES.ID,
          FIELDS_NAMES.LITTER_IDS,
          new ObjectId(id),
          '$pull'
        )
        if (!deleteResult.modifiedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'litter_routes', line: 151})
      }

      const litterDeleteResult = await deleteEntityById<Litter>(client, new ObjectId(id), COLLECTIONS.LITTERS)

      if (!litterDeleteResult.deletedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'litter_routes', line: 156})

      res.send({ message: 'Помет удален!' })

      // todo удалить все документы, связанные с пометом


    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })
}
