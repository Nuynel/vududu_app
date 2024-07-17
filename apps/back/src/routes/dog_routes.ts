import {Application, Request} from "express";
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
  searchDogByParams,
  updateBaseDogInfoById,
  verifyProfileType,
  constructProtectedDogForClient,
} from "../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {
  ClientDog,
  DATA_GROUPS,
  DatabaseDog,
  DatabaseDogEvent,
  DatabaseLitter,
  DatabaseProfile,
  ProtectedClientDogData,
  DogReproductiveHistory,
  FemaleReproductiveHistory,
  GENDER,
  HistoryRecord,
  MaleReproductiveHistory,
  PERMISSION_GROUPS,
  Permissions,
  PuppyReproductiveHistory,
  RawDogData,
  RawOtherDogData,
} from "../types";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";
import {getLitterData} from "../methods/data_methods";

type PostDogResBody = {
  message: string,
  dog: ClientDog,
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

const getPermissionsSample = (creatorProfileId: ObjectId | null = null) => {
  // todo получать шаблон пермишенов из профиля, если шаблона нет, то возвращать дефолт

  const permissions: Permissions = {
    viewers: {
      [DATA_GROUPS.PUBLIC]: {
        group: PERMISSION_GROUPS.REGISTERED,
        profileIds: [],
      },
      [DATA_GROUPS.PROTECTED]: {
        group: PERMISSION_GROUPS.ORGANISATION,
        profileIds: [],
      },
      [DATA_GROUPS.PRIVATE]: {
        group: null,
        profileIds: [],
      }
    },
    editors: {
      [DATA_GROUPS.PUBLIC]: {
        group: null,
        profileIds: creatorProfileId ? [creatorProfileId] : []
      },
      [DATA_GROUPS.PROTECTED]: {
        group: null,
        profileIds: []
      },
      [DATA_GROUPS.PRIVATE]: {
        group: null,
        profileIds: []
      },
    }
  }

  return permissions
}

const checkDogIdentification = (req: Request<{}, PostDogResBody, Omit<RawDogData | RawOtherDogData, 'litterId'>, {}>): boolean => {
  return ('microchipNumber' in req.body && !!req.body.microchipNumber) || ('tattooNumber' in req.body && !!req.body.tattooNumber)
}

export const initDogRoutes = (app: Application, client: MongoClient) => {
  app.post<{}, PostDogResBody, RawDogData | RawOtherDogData, {}>('/api/dog', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /POST/DOG, profileId >>> ', profileId)
      const profile = await verifyProfileType(client, profileId)

      // todo нельзя добавить собаку с таким же (клеймом и породой) или микрочипом

      const newDog: DatabaseDog = {
        ...req.body,

        breedId: req.body.breedId ? new ObjectId(req.body.breedId) : null,

        federationId: null,
        creatorProfileId: new ObjectId(profileId),
        ownerProfileId: checkDogIdentification(req) ? new ObjectId(profileId) : null,
        breederProfileId: null,

        name: ('name' in req.body && req.body.name) ? req.body.name as string : null,
        microchipNumber: ('microchipNumber' in req.body && req.body.microchipNumber) ? req.body.microchipNumber as string : null,
        tattooNumber: ('tattooNumber' in req.body && req.body.tattooNumber) ? req.body.tattooNumber as string : null,
        pedigreeNumber: ('pedigreeNumber' in req.body && req.body.pedigreeNumber) ? req.body.pedigreeNumber as string : null,

        litterId: req.body.litterId ? new ObjectId(req.body.litterId) : null,
        puppyCardId: null,
        puppyCardNumber: null,
        reproductiveHistory: getNewDogReproductiveHistory(req.body.gender),
        pedigreeId: null,
        treatmentIds: null,
        diagnosticIds: null,
        healthCertificateIds: null,
        permissions: getPermissionsSample(checkDogIdentification(req)  ? new ObjectId(profileId) : null),
      }

      const { insertedId: dogId } = await insertEntity(client, COLLECTIONS.DOGS, newDog);

      if (req.body.litterId) await modifyNestedArrayFieldById(client, COLLECTIONS.LITTERS, new ObjectId(req.body.litterId), dogId, FIELDS_NAMES.PUPPY_IDS)
      await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, new ObjectId(profileId), dogId, checkDogIdentification(req) ? FIELDS_NAMES.OWN_DOG_IDS : FIELDS_NAMES.OTHER_DOG_IDS);
      if (profile && newDog.breedId) {
        await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, new ObjectId(profileId), newDog.breedId, FIELDS_NAMES.BREED_IDS, '$addToSet');
      }
      const dog = await constructDogForClient(client, {...newDog, _id: dogId})
      res.send({ message: 'Собака добавлена!', dog})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  });

  app.get<
    {},
    { dogs: (WithId<Pick<DatabaseDog, 'fullName' | 'dateOfBirth' | 'gender' | 'ownerProfileId' | 'creatorProfileId' | 'federationId' | 'name' | 'dateOfDeath' | 'color' | 'isNeutered'>> & {breedId: string, litterData: HistoryRecord | null})[] },
    {},
    Pick<DatabaseDog, 'dateOfBirth' | 'gender'> & {breedId: string}
  >('/api/validate-new-dog', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /GET/CHECK-DOG, profileId >>> ', profileId)
      await verifyProfileType(client, profileId)

      const dogs = await searchDogByParams(client, {...req.query, breedId: new ObjectId(req.query.breedId)})

      if (!dogs) return res.send({dogs: []})

      // todo dateOfDeath, color, isNeutered - это может быть чувствительная информация,
      //  может её стоит перенести из публичной или просто не возвращать?

      const preparedDogsData = await Promise.all(
        dogs.map(async (dog) => {
          const litterData = dog.litterId ? await getLitterData(client, dog.litterId) : null
          return {...dog, ...req.query, litterData}
        }))

      res.send({dogs: preparedDogsData})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  // // апи для добавления группы щенков через карту помета
  // app.post('/api/puppies', async (req, res) => {
  //
  // })

  app.get<{}, ProtectedClientDogData, {}, {id: string}>('/api/dog', async (req, res) => {
    try {
      const { profileId } = getCookiesPayload(req);
      const { id } = req.query;
      console.log(getTimestamp(), 'REQUEST TO /GET/DOG, profileId >>> ', profileId, ' dogId >>> ', id)
      const dog = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(id))
      const profile = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId))
      if (!dog || !profile) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 210})
      const protectedDogForClient: ProtectedClientDogData = await constructProtectedDogForClient(client, dog, profile)
      res.send(protectedDogForClient)
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get<{}, { studs: Pick<WithId<DatabaseDog>, '_id' | 'fullName' | 'breedId'>[] }, {}, { searchString: string, gender: GENDER}>('/api/stud', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/STUD, profileId >>> ', profileId)
      const { searchString, gender } = req.query;
      const studs = await findStudsBySearchString(client, FIELDS_NAMES.FULL_NAME, gender, searchString);
      // todo добавить защиту для данных от пользователей, у которых нет к ним доступа

      res.send({studs})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get<{}, {protectedOtherDogs: WithId<ProtectedClientDogData>[]}, {}, {}>('/api/other-dogs', async(req, res) => {
    // todo когда пользователь просматривает уже добавленных им собак, то он имеет право просматривать их клички и дату рождения?
    //  и данные владельца, если он добавлен. Если владельца нет, то пермишены базовые, если появился владелец и скрыл вообще все, то добавивший имеет право смотреть
    //  кличку, день рождени, породу, пол

    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/OTHER-DOGS, profileId >>> ', profileId)
      const profile = await verifyProfileType(client, profileId)
      const otherDogs = await findEntitiesByIds<DatabaseDog>(client, COLLECTIONS.DOGS, profile.otherDogIds);
      if (!profile) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 226})

      const protectedOtherDogs = await Promise.all(
        otherDogs.map(async (dog): Promise<ProtectedClientDogData> => await constructProtectedDogForClient(client, dog, profile)))

      res.send({protectedOtherDogs})
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

  app.put<{}, {message: string}, {rawDogInfo: RawDogData, isAssigment: boolean}, {id: string}>('/api/dog', async(req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /PUT/DOG, profileId >>> ', profileId)
      const profile = await verifyProfileType(client, profileId)
      const {rawDogInfo, isAssigment} = req.body;
      const { id} = req.query;

      // todo собаку могут редактировать только владелец или создатель (последний только в определенных случаях)

      const previousDogData: WithId<DatabaseDog> | null = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(id))
      if (!previousDogData) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'dog_routes', line: 191})
      await updateBaseDogInfoById(
        client,
        new ObjectId(id),
        {
          ...rawDogInfo,
          litterId:  rawDogInfo.litterId ? new ObjectId(rawDogInfo.litterId) : null,
          breedId: rawDogInfo.breedId ? new ObjectId(rawDogInfo.breedId) : null,
          ownerProfileId: isAssigment ? new ObjectId(profileId) : null,
        }
      )

      if (rawDogInfo.litterId) await modifyNestedArrayField(
        client,
        COLLECTIONS.LITTERS,
        new ObjectId(rawDogInfo.litterId),
        FIELDS_NAMES.ID,
        FIELDS_NAMES.PUPPY_IDS,
        new ObjectId(id),
        '$addToSet'
      )

      const isAssociatedLitterChanged = !!rawDogInfo.litterId && (previousDogData.litterId !== new ObjectId(rawDogInfo.litterId))
      const isAssociatedLitterRemoved = !rawDogInfo.litterId

      if (previousDogData.litterId && (isAssociatedLitterChanged || isAssociatedLitterRemoved)) await modifyNestedArrayField(
        client,
        COLLECTIONS.LITTERS,
        new ObjectId(previousDogData.litterId),
        FIELDS_NAMES.ID,
        FIELDS_NAMES.PUPPY_IDS,
        new ObjectId(id),
        '$pull'
      )

      if (isAssigment) {
        await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, new ObjectId(profileId), new ObjectId(id), FIELDS_NAMES.OWN_DOG_IDS);
      }

      if (profile && rawDogInfo.breedId) {
        await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, new ObjectId(profileId), new ObjectId(rawDogInfo.breedId), FIELDS_NAMES.BREED_IDS, '$addToSet');
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
          await deleteEntityById<DatabaseDogEvent>(client, eventId, COLLECTIONS.EVENTS)
        }))
      }
      if (dog.reproductiveHistory?.heatIds?.length) {
        await Promise.all(dog.reproductiveHistory?.heatIds.map(async (eventId) => {
          await deleteEventFromProfile(eventId, new ObjectId(profileId), client)
          await deleteEntityById<DatabaseDogEvent>(client, eventId, COLLECTIONS.EVENTS)
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
        FIELDS_NAMES.OWN_DOG_IDS,
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
