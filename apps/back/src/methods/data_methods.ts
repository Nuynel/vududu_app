import {MongoClient, ObjectId, WithId} from "mongodb";
import {
  ClientDog,
  ClientLitter,
  DatabaseDog,
  DatabaseDogEvent,
  DatabaseLitter,
  DatabaseProfile,
  EVENT_TYPE,
  HistoryRecord
} from "../types";
import {findEntityById} from "./db_methods";
import {COLLECTIONS} from "../constants";
import {CustomError, ERROR_NAME} from "./error_messages_methods";

export const formatSingleDate = (dateString: string) => {
  const date = new Date(dateString);
  // Получаем день, месяц и год, учитывая смещение временной зоны
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getUTCFullYear();
  return `${day}.${month}.${year}`;
};

export const constructLitterForClient = async (client: MongoClient, rawLitterData: WithId<DatabaseLitter>): Promise<ClientLitter> => {

  // todo добавить номер родословных отца и матери, список документов (общепометка, договор вязки, акт вязки)

  const father = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(rawLitterData.fatherId))
  const mother = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(rawLitterData.motherId))

  if (!father || !mother) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 23});

  const parentsData = { // todo а это точно требуется? надо перепроверить
    fatherData: {id: rawLitterData.fatherId.toHexString(), fullName: father.fullName},
    motherData: {id: rawLitterData.motherId.toHexString(), fullName: mother.fullName},
  }

  const creatorProfile = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, rawLitterData.creatorProfileId)

  const puppiesData: (WithId<DatabaseDog> | null)[] = (await Promise.all(rawLitterData.puppyIds.map(
    puppyId => findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(puppyId))
  )))

  return {
    ...rawLitterData,
    ...parentsData,
    puppiesData: puppiesData.map(puppyData => {
      if (!puppyData) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 83})
      return { id: puppyData._id.toHexString(), fullName: puppyData.fullName, verified: false }
    }),
    creatorProfileName: creatorProfile ? creatorProfile.name : '',
  }
}

export const getLitterData = async <T extends boolean | { fatherOwner: boolean, motherOwner: boolean }> (client: MongoClient, litterId: ObjectId, dogId: ObjectId | null = null)
  : Promise<HistoryRecord & {verified: T}> => {
  const litter = await findEntityById<DatabaseLitter>(client, COLLECTIONS.LITTERS, litterId)

  if (!litter) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 94});

  const father = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(litter.fatherId))
  const mother = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(litter.motherId))

  if (!father || !mother) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 99});

  // если передан dogId, то проверяют, есть ли собака в верефицированных щенках этого помёта,
  // а если dogId не передан, то собака - производитель и проверяется, верифицирован ли помет в целом

  const verified = dogId
    ? litter.verifiedPuppyIds.some(id => id.equals(dogId))
    : litter.verified

  return {id: litterId, date: [litter.dateOfBirth], title: `${father.fullName}/${mother.fullName}`, verified: verified as T}
}

export const constructDogForClient = async (client: MongoClient, rawDogData: WithId<DatabaseDog>): Promise<ClientDog> => {
  const litterData = rawDogData.litterId ? await getLitterData<boolean>(client, rawDogData.litterId, rawDogData._id) : null

  const littersData = rawDogData.reproductiveHistory.litterIds ? await Promise.all(
    rawDogData.reproductiveHistory.litterIds.map(
      litterId => getLitterData<{ fatherOwner: boolean, motherOwner: boolean }>(client, litterId)
    )
  ) : rawDogData.reproductiveHistory.litterIds

  const creatorProfile = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, rawDogData.creatorProfileId)
  const ownerProfile = rawDogData.ownerProfileId ? await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, rawDogData.ownerProfileId) : null;

  let allTreatments: (WithId<DatabaseDogEvent> | null)[] = []

  if (rawDogData.treatmentIds) {
    allTreatments = await Promise.all(rawDogData.treatmentIds.map(id => {
      return findEntityById<DatabaseDogEvent>(client, COLLECTIONS.EVENTS, id)
    }))
  }

  const treatments = allTreatments.reduce((acc: HistoryRecord[], event) => {
    return event && event.eventType === EVENT_TYPE.ANTIPARASITIC_TREATMENT ? [...acc, {
      id: event._id,
      title: event.medication,
      date: event.date
    }] : acc
  }, [])

  const vaccinations = allTreatments.reduce((acc: HistoryRecord[], event) => {
    return event && event.eventType === EVENT_TYPE.VACCINATION ? [...acc, {
      id: event._id,
      title: event.medication,
      date: event.date
    }] : acc
  }, [])

  return {
    ...rawDogData,
    litterData,
    diagnostics: null,
    healthCertificates: null,
    treatments,
    vaccinations,
    reproductiveHistory: {
      litters: littersData,
      heats: rawDogData.reproductiveHistory.heatIds,
      mates: rawDogData.reproductiveHistory.mateIds,
      births: rawDogData.reproductiveHistory.birthIds,
    },
    creatorProfileName: creatorProfile ? creatorProfile.name : '',
    ownerProfileName: ownerProfile ? ownerProfile.name : ''
  }
}
