import {Application} from "express";
import {MongoClient, ObjectId, WithId} from "mongodb";
import {
  constructDogForClient,
  deleteEntityById,
  deleteEventFromProfile,
  errorHandler,
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
  RawDogData,
  ClientDog,
  DatabaseDog,
  DatabaseEvent,
  DOG_TYPES,
  GENDER,
  // Litter,
  DatabaseLitter,
  PuppyReproductiveHistory,
  DogReproductiveHistory,
  MaleReproductiveHistory,
  FemaleReproductiveHistory,
  DatabaseProfile,
} from "../types";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";

type PostDogResBody = {
  message: string,
  dog: ClientDog,
}

const getNewDogType = (gender: GENDER): DOG_TYPES => {
  // todo потом расширить для ипов PUPPY и STUD
  return gender === GENDER.MALE ? DOG_TYPES.MALE_DOG : DOG_TYPES.FEMALE_DOG
}

const getNewDogReproductiveHistory = (gender: GENDER):
  | PuppyReproductiveHistory | DogReproductiveHistory | MaleReproductiveHistory | FemaleReproductiveHistory => {
  return gender === GENDER.MALE ? {
    heatIds: null,
    mateIds: [],
    pregnancyIds: null,
    birthIds: null,
    litterIds: [],
  } : {
    heatIds: [],
    mateIds: [],
    pregnancyIds: [],
    birthIds: [],
    litterIds: [],
  }
}

export const initDogRoutes = (app: Application, client: MongoClient) => {
  app.post<{}, PostDogResBody, Omit<RawDogData, 'litterId'>, {}>('/api/dog', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /POST/DOG, profileId >>> ', profileId)
      const profile = await verifyProfileType(client, profileId)

      const newDog: DatabaseDog = {
        ...req.body,

        breedId: req.body.breedId ? new ObjectId(req.body.breedId) : null,

        creatorProfileId: new ObjectId(profileId),
        ownerProfileId: null,
        breederProfileId: null,
        litterId: null,
        puppyCardId: null,
        puppyCardNumber: null,
        type: getNewDogType(req.body.gender),
        reproductiveHistory: getNewDogReproductiveHistory(req.body.gender),
        pedigreeId: null,
        treatmentIds: null,
        diagnosticIds: null,
      }

      const { insertedId: dogId } = await insertEntity(client, COLLECTIONS.DOGS, newDog);
      await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, new ObjectId(profileId), dogId, FIELDS_NAMES.DOGS_IDS);
      if (profile && newDog.breedId && !profile.breedIds.includes(new ObjectId(newDog.breedId))) {
        await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, new ObjectId(profileId), newDog.breedId, FIELDS_NAMES.BREED_IDS);
      }
      const dog = await constructDogForClient(client, {...newDog, _id: dogId})
      res.send({ message: 'Собака добавлена!', dog})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  });

  // // апи для добавления группы щенков через карту помета
  // app.post('/api/puppies', async (req, res) => {
  //
  // })

  // app.post('/api/stud', async (req, res) => {
  //   try {
  //     const {profileId} = getCookiesPayload(req);
  //     console.log(getTimestamp(), 'REQUEST TO /POST/STUD, profileId >>> ', profileId)
  //     const newStudDog: Dog = { ...req.body, isLinkedToOwner: false, reproductiveHistory: {
  //         heatIds: null,
  //         mateIds: null,
  //         pregnancyIds: null,
  //         birthIds: null,
  //         litterIds: [],
  //         type: DOG_TYPES.DOG,
  //       } }
  //     const { insertedId: studDogId } = await insertEntity(client, COLLECTIONS.STUD_DOGS, newStudDog);
  //     res.send({ message: 'Предок добавлен!' })
  //   } catch (e) {
  //     if (e instanceof Error) errorHandler(res, e)
  //   }
  // })

  // app.get('/api/dogs', async (req, res) => {
  //   try {
  //     const {profileId} = getCookiesPayload(req);
  //     console.log(getTimestamp(), 'REQUEST TO /GET/DOGS, profileId >>> ', profileId)
  //     const profile = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId))
  //     if (!profile) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 126})
  //     if (!isKennelOrBreedProfile(profile)) throw new CustomError(ERROR_NAME.INVALID_PROFILE_TYPE, {file: 'dog_routes', line: 127})
  //     const { dogIds } = profile;
  //     if (!dogIds) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 129})
  //     const dogs: WithId<DatabaseDog>[] = await findEntitiesByIds<DatabaseDog>(client, COLLECTIONS.DOGS, dogIds.map(str => new ObjectId(str)))
  //     res.send({dogs})
  //   } catch (e) {
  //     if (e instanceof Error) errorHandler(res, e)
  //   }
  // })

  app.get<{}, { studs: Pick<WithId<DatabaseDog>, '_id' | 'fullName' | 'breedId'>[] }, {}, { searchString: string, gender: GENDER}>('/api/stud', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/STUD, profileId >>> ', profileId)
      const { searchString, gender } = req.query;
      const studs = await findStudsBySearchString(client, FIELDS_NAMES.FULL_NAME, gender, searchString);
      res.send({studs})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })


  // todo нужно ли возвращать breedId в данных щенков?
  app.get<{}, { puppies: Pick<WithId<DatabaseDog>, '_id' | 'fullName' | 'breedId'>[] }, {}, { dateOfBirth: string, breedId: string }>('/api/puppies', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/PUPPIES, profileId >>> ', profileId)
      const { dateOfBirth, breedId } = req.query;
      const puppies = await findPuppiesByDateOfBirth(client, dateOfBirth, breedId ? new ObjectId(breedId) : null);
      res.send({puppies})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.put<{}, {message: string}, {rawDogInfo: RawDogData}, {id: string}>('/api/dog', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /PUT/DOG, profileId >>> ', profileId)
      const profile = await verifyProfileType(client, profileId)
      const {rawDogInfo} = req.body;
      const { id } = req.query;

      await updateBaseDogInfoById(
        client,
        new ObjectId(id),
        {
          ...rawDogInfo,
          litterId:  rawDogInfo.litterId ? new ObjectId(rawDogInfo.litterId) : null,
          breedId: rawDogInfo.breedId ? new ObjectId(rawDogInfo.breedId) : null,
        }
      )

      if (rawDogInfo.litterId) await modifyNestedArrayField(
        client,
        COLLECTIONS.LITTERS,
        new ObjectId(rawDogInfo.litterId),
        FIELDS_NAMES.ID,
        FIELDS_NAMES.PUPPY_IDS,
        new ObjectId(id),
      )
      if (profile && rawDogInfo.breedId && !profile.breedIds.includes(new ObjectId(rawDogInfo.breedId))) {
        await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, new ObjectId(profileId), new ObjectId(rawDogInfo.breedId), FIELDS_NAMES.BREED_IDS);
      }
      res.status(200).send({message: 'Base dog info was updated successfully!'})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.delete<{}, {message: string}, {}, {id: string}>('/api/dog', async(req, res) => {
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
        const deleteResult = await modifyNestedArrayField<DatabaseLitter>(
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

      const deleteResult = await modifyNestedArrayField<DatabaseProfile>(
        client,
        COLLECTIONS.PROFILES,
        new ObjectId(dog.creatorProfileId),
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
