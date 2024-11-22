import {Application} from "express";
import {MongoClient, ObjectId} from "mongodb";
import {BreederProfile, ClientLitter, DatabaseDog, DatabaseLitter, KennelProfile, RawLitterData} from "../types";
import {
  assignIdToField,
  constructLitterForClient,
  deleteEntityById,
  errorHandler,
  findEntityById,
  findLittersByDate,
  getCookiesPayload,
  getPermissionsSample,
  getTimestamp,
  insertEntity,
  modifyNestedArrayField,
  modifyNestedArrayFieldById,
  updateBaseLitterInfoById,
  verifyProfileType
} from "../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";

// todo владелец кобеля не может добавлять помет!!! Это может делать только владелец суки

// todo подумать над тем кто может добавлять информацию о пометах и какой доступ имеет к ней.
//  Например, можно ли ограничить владельца кобеля в доступе к информации о помете

// если creatorProfileId === mother.ownerProfileId, то профиль является владельцем

const checkLitterOwner = async (motherId: string, client: MongoClient, profileId: ObjectId): Promise<boolean> => {
  const mother = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(motherId))
  if (!mother) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'litter_routes', line: 34})
  const creatorProfileId = new ObjectId(profileId)
  return creatorProfileId.equals(mother.ownerProfileId)
}

export const initLitterRoutes = (app: Application, client: MongoClient) => {
  app.post<{}, {litter: ClientLitter}, RawLitterData, {}>('/api/litter', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /POST/LITTERS, profileId >>> ', profileId)
      await verifyProfileType(client, profileId)
      const isOwner = await checkLitterOwner(req.body.motherId, client, new ObjectId(profileId))
      const newLitter: DatabaseLitter = {
        ...req.body,
        creatorProfileId: new ObjectId(profileId),
        fatherId: new ObjectId(req.body.fatherId),
        motherId: new ObjectId(req.body.motherId),
        puppyIds: req.body.puppyIds.map((puppyId: string) => new ObjectId(puppyId)),
        verifiedPuppyIds: [],
        breedId: req.body.breedId ? new ObjectId(req.body.breedId) : null,
        litterSummary: { //todo puppies count
          male: null,
          female: null
        },
        verified: {
          fatherOwner: false,
          motherOwner: false,
        }, // todo verified
        federationId: null,
        permissions: getPermissionsSample(isOwner ? null : new ObjectId(profileId))
      }
      const { insertedId: litterId } = await insertEntity(client, COLLECTIONS.LITTERS, newLitter)
      await modifyNestedArrayFieldById<DatabaseDog>(client, COLLECTIONS.DOGS, newLitter.fatherId,
        litterId, FIELDS_NAMES.REPRODUCTIVE_HISTORY_LITTER_IDS)
      await modifyNestedArrayFieldById<DatabaseDog>(client, COLLECTIONS.DOGS, newLitter.motherId,
        litterId, FIELDS_NAMES.REPRODUCTIVE_HISTORY_LITTER_IDS)
      await Promise.all(newLitter.puppyIds.map(async (puppyId) => {
        await assignIdToField<DatabaseDog>(client, COLLECTIONS.DOGS, puppyId, FIELDS_NAMES.LITTER_ID, litterId)
      }))
      await modifyNestedArrayFieldById<KennelProfile | BreederProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId), litterId, FIELDS_NAMES.LITTER_IDS)
      const litter = await constructLitterForClient(client, { ...newLitter, _id: litterId })
      res.send({ litter })
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  });

  // ToDo поиск пометов для миксов!!!
  app.get<{}, { litters: Pick<ClientLitter, '_id' | 'litterTitle' | 'dateOfBirth'>[] }, {}, { date: string, breedId: string }>('/api/litters', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/LITTERS, profileId >>> ', profileId)
      const { date, breedId } = req.query;
      const litters= await findLittersByDate(client, date, breedId ? new ObjectId(breedId) : null);
      res.send({ litters })
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.put<{}, {message: string}, Pick<RawLitterData, 'comments'>, {id: string}>('/api/litter', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /PUT/LITTER, profileId >>> ', profileId)
      const { id } = req.query;

      await updateBaseLitterInfoById(client, new ObjectId(id), req.body)

      // ToDo если поменялась дата рождения - отвязать всех щенков
      res.status(200).send({message: 'Base litter info was updated successfully!'})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  // todo удалить все документы, связанные с пометом

  app.delete<{}, {message: string}, {}, {id: string}>('/api/litter', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      const { id } = req.query;
      console.log(getTimestamp(), 'REQUEST TO /DELETE/LITTER, profileId >>> ', profileId, ' >>> litterId >>> ', id)

      const litter = await findEntityById<DatabaseLitter>(client, COLLECTIONS.LITTERS, new ObjectId(id))
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

      if (litter.creatorProfileId) {
        const deleteResult = await modifyNestedArrayField<DatabaseDog>(
          client,
          COLLECTIONS.PROFILES,
          new ObjectId(litter.creatorProfileId),
          FIELDS_NAMES.ID,
          FIELDS_NAMES.LITTER_IDS,
          new ObjectId(id),
          '$pull'
        )
        if (!deleteResult.modifiedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'litter_routes', line: 151})
      }

      const litterDeleteResult = await deleteEntityById<DatabaseLitter>(client, new ObjectId(id), COLLECTIONS.LITTERS)

      if (!litterDeleteResult.deletedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'litter_routes', line: 156})

      res.send({ message: 'Помет удален!' })

      // todo удалить все документы, связанные с пометом


    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })
}
