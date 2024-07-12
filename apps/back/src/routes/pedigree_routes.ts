import {Application} from "express";
import {MongoClient, ObjectId, WithId} from "mongodb";
import {DatabaseDog, DatabaseLitter, DatabaseProfile, ProtectedClientDogData} from "../types";
import {
  errorHandler,
  findEntityById,
  getCookiesPayload,
  getTimestamp,
  constructProtectedDogForClient
} from "../methods";
import {COLLECTIONS} from "../constants";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";

// получить собаку по айдишнику

// достать её информацию о помете

// достать из информации о помете информацию о родителях

// глубина родословной

// {id: string, father: string | null, mother: string | null}[]
// {fullName, dateOfBirth, microchipNumber, pedigreeNumber, color, }

const PEDIGREE_TYPES_CONFIG = {
  COMMON: {
    DEPTH: 5
  },
  EXTENDED: {
    DEPTH: 9
  }
}

type Pedigree = (ProtectedClientDogData & {
  father: Pedigree | null,
  mother: Pedigree | null,
  position: string,
}) | null

const getPedigree = async (depth: number, client: MongoClient, id: ObjectId | string, profile: WithId<DatabaseProfile>, position: string = ''): Promise<Pedigree> => {
  if (depth <= 0) return null

  const dog = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(id))
  if (!dog) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'pedigree_routes', line: 38})

  const protectedDogData = await constructProtectedDogForClient(client, dog, profile)

  if (!protectedDogData.litterData?.id || depth <= 0) {
    return {
      ...protectedDogData,
      father: null,
      mother: null,
      position: position,
    }
  }

  const litter = await findEntityById<DatabaseLitter>(client, COLLECTIONS.LITTERS, new ObjectId(protectedDogData.litterData?.id))
  if (!litter) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'pedigree_routes', line: 50})

  return {
    ...protectedDogData,
    father: await getPedigree(depth - 1, client, litter.fatherId, profile, position + 'f'),
    mother: await getPedigree(depth - 1, client, litter.motherId, profile, position + 'm'),
    position: position,
  }
}

export const initPedigreeRoutes = (app: Application, client: MongoClient) => {
  app.get<{}, { pedigree: Pedigree }, {}, { id: string, type: keyof typeof PEDIGREE_TYPES_CONFIG}>('/api/pedigree', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      const { id, type } = req.query;
      console.log(getTimestamp(), 'REQUEST TO /GET/PEDIGREE, profileId >>> ', profileId, ' >>> dogId >>> ', id)
      const profile = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId))
      if (!profile) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'pedigree_routes', line: 210})

      const depth = PEDIGREE_TYPES_CONFIG[type].DEPTH

      const pedigree: Pedigree = await getPedigree(depth, client, id, profile)

      res.send({ pedigree })
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })
}
