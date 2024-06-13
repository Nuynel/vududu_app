import {ObjectId, WithId} from "mongodb";
import {HistoryRecord} from "./index";

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum DOG_TYPES {
  PUPPY = 'PUPPY',
  STUD = 'STUD',
  MALE_DOG = 'MALE_DOG',
  FEMALE_DOG = 'FEMALE_DOG',
}


export type PuppyReproductiveHistory = {
  heatIds: null;
  mateIds: null;
  pregnancyIds: null;
  birthIds: null;
  litterIds: null;
}

export type DogReproductiveHistory = {
  heatIds: null;
  mateIds: null;
  pregnancyIds: null;
  birthIds: null;
  litterIds: ObjectId[];
}

export type MaleReproductiveHistory = {
  heatIds: null;
  mateIds: ObjectId[];
  pregnancyIds: null;
  birthIds: null;
  litterIds: ObjectId[];
}

export type FemaleReproductiveHistory = {
  heatIds: ObjectId[];
  mateIds: ObjectId[];
  pregnancyIds: ObjectId[];
  birthIds: ObjectId[];
  litterIds: ObjectId[];
}

type ReproductiveHistory = {
  heatIds: null | ObjectId[];
  mateIds: null | ObjectId[];
  pregnancyIds: null | ObjectId[];
  birthIds: null | ObjectId[];
  litterIds: null | ObjectId[];
}

export type DatabaseDog = {
  name: string | null; // домашняя кличка (может быть даже цвет ошейника)
  fullName: string; // todo добавить null на случай когда добавляют щенков вместе с пометом
  dateOfBirth: string;
  dateOfDeath: string;
  breedId: ObjectId | null;
  gender: GENDER;
  microchipNumber: string | null;
  tattooNumber: string | null;
  pedigreeNumber: string | null;
  color: string | null;
  isNeutered: boolean | null; // данные о кастрации, null для собак, у которых isLinkedToOwner: false

  creatorProfileId: ObjectId;
  ownerProfileId: ObjectId | null;
  breederProfileId: ObjectId | null;

  litterId: ObjectId | null; // в базе данных тут только ObjectId, но клиенту будем отдавать HistoryRecord
  reproductiveHistory: ReproductiveHistory;
  treatmentIds: ObjectId[] | null;
  diagnosticIds: ObjectId[] | null;

  puppyCardId: ObjectId | null; // ссылка на документ (щенячку)
  puppyCardNumber: string | null;
  type: DOG_TYPES;
  pedigreeId: ObjectId | null;
}

export type ClientDog = Omit<WithId<DatabaseDog>, 'litterId' | 'reproductiveHistory' | 'diagnosticIds' | 'treatmentIds'> & {
  litterData: HistoryRecord | null;
  diagnostics: HistoryRecord[] | null;
  treatments: HistoryRecord[] | null;
  vaccinations: HistoryRecord[] | null;
  reproductiveHistory: {
    litters: HistoryRecord[] | null;
    heats: ObjectId[] | null;
    mates: ObjectId[] | null;
    births: ObjectId[] | null;
  }
}

export type RawDogFields =
  | 'name'
  | 'fullName'
  | 'dateOfBirth'
  | 'dateOfDeath'
  | 'gender'
  | 'microchipNumber'
  | 'tattooNumber'
  | 'pedigreeNumber'
  | 'color'
  | 'isNeutered'

export type RawDogData = Pick<DatabaseDog, RawDogFields> & {
  litterId: string | null;
  breedId: string | null;
}
