import {MongoClient, ObjectId, WithId} from "mongodb";
import {Breed, DatabaseDog, DatabaseEvent, EVENT_TYPE, Litter} from "../types";
import {findEntityById} from "./db_methods";
import {COLLECTIONS} from "../constants";
import {CustomError, ERROR_NAME} from "./error_messages_methods";

type HistoryRecord = {
  id: string | ObjectId,
  date: string[] | null,
  title: string | null,
}

type CommonClientDogFields = 'profileId' | 'litterId' | 'isLinkedToOwner' | 'gender'
  | 'dateOfBirth' | 'name' | 'color' | 'puppyCardId' | 'puppyCardNumber' | 'microchipNumber' | 'tattooNumber'
  | 'fullName' | 'isNeutered' | 'type' | 'pedigreeNumber' | 'pedigreeId'

type ClientDog = Pick<DatabaseDog, CommonClientDogFields> & {
  _id: ObjectId;
  breedId: ObjectId;
  litterData: {
    date: string[] | null,
    title: string | null,
  }
  diagnostics: null | ObjectId[] | HistoryRecord[];
  treatments: null | ObjectId[] | HistoryRecord[];
  vaccinations: null | ObjectId[] | HistoryRecord[];
  reproductiveHistory: {
    litters: null | HistoryRecord[];
    heats: null | ObjectId[] | HistoryRecord[];
    mates: null | ObjectId[] | HistoryRecord[];
    births: null | ObjectId[] | HistoryRecord[];
  }
}

type ClientLitter = Litter & {
  fatherFullName: string | null,
  fatherName: string | null,
  motherFullName: string | null,
  motherName: string | null,
  litterTitle: string,
  puppiesData: {
    id: ObjectId | string,
    name: string | null,
    fullName: string | null,
  }[]
}

export const formatSingleDate = (dateString: string) => {
  const date = new Date(dateString);
  // Получаем день, месяц и год, учитывая смещение временной зоны
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
  const year = date.getUTCFullYear();
  return `${day}.${month}.${year}`;
};

export const constructLitterForClient = async (client: MongoClient, rawLitterData: WithId<Litter>): Promise<ClientLitter> => {

  // todo добавить номер родословных отца и матери, список документов (общепометка, договор вязки, акт вязки)

  const father = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(rawLitterData.fatherId))
  const mother = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(rawLitterData.motherId))

  if (!father || !mother) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 63});

  const parentNames = {
    fatherFullName: father.fullName,
    fatherName: father.name,
    motherFullName: mother.fullName,
    motherName: mother.name,
  }

  const litterTitle = `${formatSingleDate(rawLitterData.dateOfBirth)}, ${father.name}/${mother.name}`

  const puppiesData: (WithId<DatabaseDog> | null)[] = (await Promise.all(rawLitterData.puppyIds.map(
    puppyId => findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(puppyId))
  )))

  return {
    ...rawLitterData,
    ...parentNames,
    litterTitle,
    puppiesData: puppiesData.map(puppyData => {
      if (!puppyData) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 83})
      return { id: puppyData._id, name: puppyData.name, fullName: puppyData.fullName }
    })
  }
}

const getMainLitterData = async (client: MongoClient, litterId: string | ObjectId | null) => {

  if (!litterId) return {title: null, date: null}
  const litter = await findEntityById(client, COLLECTIONS.LITTERS, new ObjectId(litterId))

  if (!litter) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 94});

  const father = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(litter.fatherId))
  const mother = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(litter.motherId))

  if (!father || !mother) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 99});

  return {date: [litter.dateOfBirth], title: `${father.name}/${mother.name}`}
}

const getLitterData = async (client: MongoClient, litterId: ObjectId): Promise<HistoryRecord> => {
  const {title, date} = await getMainLitterData(client, litterId)
  return { id: litterId, title, date }
}

export const constructDogForClient = async (client: MongoClient, rawDogData: WithId<DatabaseDog>): Promise<ClientDog> => {
  const litterData = await getMainLitterData(client, rawDogData.litterId)

  const littersData = rawDogData.reproductiveHistory.litterIds ? await Promise.all(
    rawDogData.reproductiveHistory.litterIds.map(
      litterId => getLitterData(client, litterId)
    )
  ) : rawDogData.reproductiveHistory.litterIds

  let allTreatments: (WithId<DatabaseEvent> | null)[] = []

  if (rawDogData.treatmentIds) {
    allTreatments = await Promise.all(rawDogData.treatmentIds.map(id => {
      return findEntityById<DatabaseEvent>(client, COLLECTIONS.EVENTS, id)
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
    treatments,
    vaccinations,
    reproductiveHistory: {
      litters: littersData,
      heats: rawDogData.reproductiveHistory.heatIds,
      mates: rawDogData.reproductiveHistory.mateIds,
      births: rawDogData.reproductiveHistory.birthIds,
    }
  }
}
