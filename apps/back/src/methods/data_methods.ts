import {MongoClient, ObjectId, WithId} from "mongodb";
import {HistoryRecord, DatabaseDog, DatabaseDogEvent, EVENT_TYPE, DatabaseLitter, ClientLitter, ClientDog} from "../types";
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

  if (!father || !mother) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 63});

  const parentNames = {
    fatherFullName: father.fullName,
    motherFullName: mother.fullName,
  }

  const litterTitle = `${formatSingleDate(rawLitterData.dateOfBirth)}, ${father.fullName}/${mother.fullName}`

  const puppiesData: (WithId<DatabaseDog> | null)[] = (await Promise.all(rawLitterData.puppyIds.map(
    puppyId => findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(puppyId))
  )))

  return {
    ...rawLitterData,
    ...parentNames,
    litterTitle,
    puppiesData: puppiesData.map(puppyData => {
      if (!puppyData) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 83})
      return { id: puppyData._id.toHexString(), name: puppyData.name, fullName: puppyData.fullName, status: false }
    })
  }
}

const getLitterData = async (client: MongoClient, litterId: ObjectId): Promise<HistoryRecord> => {
  const litter = await findEntityById(client, COLLECTIONS.LITTERS, litterId)

  if (!litter) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 94});

  const father = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(litter.fatherId))
  const mother = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(litter.motherId))

  if (!father || !mother) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'data_methods', line: 99});

  return {id: litterId, date: [litter.dateOfBirth], title: `${father.fullName}/${mother.fullName}`}
}

export const constructDogForClient = async (client: MongoClient, rawDogData: WithId<DatabaseDog>): Promise<ClientDog> => {
  const litterData = rawDogData.litterId ? await getLitterData(client, rawDogData.litterId) : null

  const littersData = rawDogData.reproductiveHistory.litterIds ? await Promise.all(
    rawDogData.reproductiveHistory.litterIds.map(
      litterId => getLitterData(client, litterId)
    )
  ) : rawDogData.reproductiveHistory.litterIds

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
    }
  }
}
