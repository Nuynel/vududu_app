import {Application} from "express";
import {MongoClient, ObjectId} from "mongodb";
import {DatabaseDog, Litter} from "../types";
import {errorHandler, findEntityById, getCookiesPayload} from "../methods";
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

type Pedigree = (DatabaseDog & {
  father: Pedigree | null,
  mother: Pedigree | null,
  position: string,
}) | null

const getPedigree = async (depth: number, client: MongoClient, id: ObjectId | string, position: string = ''): Promise<Pedigree> => {
  if (depth <= 0) return null

  const dog = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(id))
  if (!dog) throw new CustomError(ERROR_NAME.DATABASE_ERROR)

  if (!dog.litterId || depth <= 0) {
    return {
      ...dog,
      father: null,
      mother: null,
      position: position,
    }
  }

  const litter = await findEntityById<Litter>(client, COLLECTIONS.LITTERS, new ObjectId(dog.litterId))
  if (!litter) throw new CustomError(ERROR_NAME.DATABASE_ERROR)

  return {
    ...dog,
    father: await getPedigree(depth - 1, client, litter.fatherId, position + 'f'),
    mother: await getPedigree(depth - 1, client, litter.motherId, position + 'm'),
    position: position,
  }
}

export const initPedigreeRoutes = (app: Application, client: MongoClient) => {
  app.get<{}, { pedigree: Pedigree }, {}, { id: string, type: keyof typeof PEDIGREE_TYPES_CONFIG}>('/api/pedigree', async (req, res) => {
    try {
      const {} = getCookiesPayload(req)

      const { id, type } = req.query;
      const depth = PEDIGREE_TYPES_CONFIG[type].DEPTH

      const dog = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(id))
      if (!dog) return new CustomError(ERROR_NAME.DATABASE_ERROR)

      // если собака не принадлежит владельцу - ограничить доступ к родословной

      const pedigree: Pedigree = await getPedigree(depth, client, id)

      res.send({ pedigree })
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }


    // const
  })
}