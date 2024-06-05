import {Application} from "express";
import {MongoClient, ObjectId, WithId} from "mongodb";
import {
  constructDogForClient,
  deleteEntityById,
  deleteEventFromProfile,
  errorHandler,
  findEntitiesByIds,
  findEntityById,
  findPuppiesByDateOfBirth,
  findStudsBySearchString,
  getCookiesPayload,
  getTimestamp,
  insertEntity,
  modifyNestedArrayField,
  modifyNestedArrayFieldById,
  updateBaseDogInfoById,
  verifyProfileType,
} from "../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {
  BaseDogInfo,
  DatabaseDog,
  DatabaseEvent,
  DatabaseProfile,
  Dog,
  DOG_TYPES,
  FemaleExtendedDog,
  GENDER,
  Litter,
  MaleExtendedDog,
  NewDog
} from "../types";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";
import {isKennelOrBreedProfile} from "./profile_routes"

const createNewDog = (newDog: NewDog): MaleExtendedDog | FemaleExtendedDog => {
  const commonFields = {
    diagnosticIds: [],
    treatmentIds: [],
    pedigreeId: null, // ToDo потом сделать добавление документа
  };

  if (newDog.gender === GENDER.MALE) {
    return {
      ...newDog,
      ...commonFields,
      type: DOG_TYPES.MALE_DOG,
      reproductiveHistory: {
        heatIds: null,
        mateIds: [],
        pregnancyIds: null,
        birthIds: null,
        litterIds: [],
      }
    };
  } else {
    return {
      ...newDog,
      ...commonFields,
      type: DOG_TYPES.FEMALE_DOG,
      reproductiveHistory: {
        heatIds: [],
        mateIds: [],
        pregnancyIds: [],
        birthIds: [],
        litterIds: [],
      }
    };
  }
}

export const initDogRoutes = (app: Application, client: MongoClient) => {
  app.post('/api/dog', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /POST/DOG, profileId >>> ', profileId)
      const profile = await verifyProfileType(client, profileId)

      const newDogData: NewDog = {
        ...req.body,
        profileId: new ObjectId(profileId),
        litterId: req.body.litterId ? new ObjectId(req.body.litterId) : null,
        isLinkedToOwner: true,
      }

      const newDog: DatabaseDog = createNewDog(newDogData)

      const { insertedId: dogId } = await insertEntity(client, COLLECTIONS.DOGS, newDog);
      await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, new ObjectId(profileId), dogId, FIELDS_NAMES.DOGS_IDS);
      if (profile && !profile.breedIds.includes(new ObjectId(newDog.breedId))) {
        await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, new ObjectId(profileId), newDog.breedId, FIELDS_NAMES.BREED_IDS);
      }
      const dog = await constructDogForClient(client, {...newDog, _id: dogId})
      res.send({ message: 'Собака добавлена!', dog})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  });

  // апи для добавления группы щенков через карту помета
  app.post('/api/puppies', async (req, res) => {

  })

  app.post('/api/stud', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /POST/STUD, profileId >>> ', profileId)
      const newStudDog: Dog = { ...req.body, isLinkedToOwner: false, reproductiveHistory: {
          heatIds: null,
          mateIds: null,
          pregnancyIds: null,
          birthIds: null,
          litterIds: [],
          type: DOG_TYPES.DOG,
        } }
      const { insertedId: studDogId } = await insertEntity(client, COLLECTIONS.STUD_DOGS, newStudDog);
      res.send({ message: 'Предок добавлен!' })
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get('/api/dogs', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/DOGS, profileId >>> ', profileId)
      const profile = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId))
      if (!profile) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 126})
      if (!isKennelOrBreedProfile(profile)) throw new CustomError(ERROR_NAME.INVALID_PROFILE_TYPE, {file: 'dog_routes', line: 127})
      const { dogIds } = profile;
      if (!dogIds) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 129})
      const dogs: WithId<DatabaseDog>[] = await findEntitiesByIds<DatabaseDog>(client, COLLECTIONS.DOGS, dogIds.map(str => new ObjectId(str)))
      res.send({dogs})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get<{}, { studs: DatabaseDog[] }, {}, { searchString: string, gender: GENDER, breedId: string }>('/api/stud', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/STUD, profileId >>> ', profileId)
      const { searchString, gender, breedId } = req.query;
      const studs = await findStudsBySearchString(client, FIELDS_NAMES.FULL_NAME, gender, searchString, new ObjectId(breedId));
      res.send({studs})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get<{}, { puppies: DatabaseDog[] }, {}, { dateOfBirth: string }>('/api/puppies', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/PUPPIES, profileId >>> ', profileId)
      const { dateOfBirth } = req.query;
      const puppies = await findPuppiesByDateOfBirth(client, dateOfBirth);
      res.send({puppies})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.put<{}, {}, {baseDogInfo: BaseDogInfo}, {id: string}>('/api/dog', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /PUT/DOG, profileId >>> ', profileId)
      const {baseDogInfo} = req.body;
      const { id } = req.query;

      await updateBaseDogInfoById(client, new ObjectId(id), baseDogInfo)

      if (baseDogInfo.litterId) await modifyNestedArrayField(
        client,
        COLLECTIONS.LITTERS,
        new ObjectId(baseDogInfo.litterId),
        FIELDS_NAMES.ID,
        FIELDS_NAMES.PUPPY_IDS,
        new ObjectId(id),
      )
      res.status(200).send({message: 'Base dog info was updated successfully!'})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.delete<{}, {}, {}, {id: string}>('/api/dog', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      const { id } = req.query;
      console.log(getTimestamp(), 'REQUEST TO /DELETE/DOG, profileId >>> ', profileId, ' >>> dogId >>> ', id)

      const dog = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(id))
      if (!dog) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 191})

      if (dog.reproductiveHistory.litterIds?.length) return new CustomError(ERROR_NAME.DELETE_ERROR, {file: 'dog_routes', line: 193})

      if (dog.treatmentIds?.length) {
        await Promise.all(dog.treatmentIds.map(async (eventId) => {
          await deleteEventFromProfile(eventId, new ObjectId(profileId), client)
          await deleteEntityById<DatabaseEvent>(client, eventId, COLLECTIONS.EVENTS)
        }))
      }
      if (dog.reproductiveHistory?.heatIds?.length) {
        await Promise.all(dog.reproductiveHistory?.heatIds.map(async (eventId) => {
          await deleteEventFromProfile(eventId, new ObjectId(profileId), client)
          await deleteEntityById<DatabaseEvent>(client, eventId, COLLECTIONS.EVENTS)
        }))
      }

      if (dog.litterId) {
        const deleteResult = await modifyNestedArrayField<Litter>(
          client,
          COLLECTIONS.LITTERS,
          new ObjectId(dog.litterId),
          FIELDS_NAMES.ID,
          FIELDS_NAMES.PUPPY_IDS,
          new ObjectId(id),
          '$pull'
        )
        if (!deleteResult.modifiedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 218})
      }

      const deleteResult = await modifyNestedArrayField<Litter>(
        client,
        COLLECTIONS.PROFILES,
        new ObjectId(dog.profileId),
        FIELDS_NAMES.ID,
        FIELDS_NAMES.DOGS_IDS,
        new ObjectId(id),
        '$pull'
      )
      if (!deleteResult.modifiedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 230})

      const dogDeleteResult = await deleteEntityById<DatabaseDog>(client, new ObjectId(id), COLLECTIONS.DOGS)

      if (!dogDeleteResult.deletedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 234})

      res.send({ message: 'Собака удалена!' })

      // todo удалить все документы, связанные с собакой

    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })
}
// ToDo надо будет переделать добавление только питомнику или владельцу, потому что владельцем может быть и просто владелец кобеля,

// если собака новая, без помета, но у неё есть родители, то можно указать родителей.
// Родителям нельзя указать щенка, связать их можно только через добавление щенка к помету

// если у собаки указаны родители и дата рождения, то автоматически проверяется наличие подходящих пометов
// эти пометы предлагаются пользователю, и если пользователь апрувает, то щенок добавляется к помету ??
// НО! Для этого уже должны быть заведеы пометы, а если помет заведен, то и щенок в нем уже будет, не надо дублировать

// так же надо предлагать пользователю сверять родителей с уже имеющимися в базе, чтобы улучшить связанность данных в базе
