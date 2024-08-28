import {ObjectId, WithId} from "mongodb";
import {HistoryRecord, Permissions, ProfilePermissionsByEntity} from "./index";

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

export type DatabaseDog = { // new: federationId, healthCertificateIds, permissions
  name: string | null; // домашняя кличка (может быть даже цвет ошейника)
  fullName: string; // todo добавить null на случай когда добавляют щенков вместе с пометом
  dateOfBirth: string;
  dateOfDeath: string | null;
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
  federationId: string | null;

  litterId: ObjectId | null; // в базе данных тут только ObjectId, но клиенту будем отдавать HistoryRecord
  reproductiveHistory: ReproductiveHistory;
  treatmentIds: ObjectId[] | null;
  diagnosticIds: ObjectId[] | null;
  healthCertificateIds: ObjectId[] | null;

  puppyCardId: ObjectId | null; // ссылка на документ (щенячку)
  puppyCardNumber: string | null;
  pedigreeId: ObjectId | null;

  permissions: Permissions;
}

export type ClientReproductiveHistory = {
  litters: HistoryRecord[] | null;
  heats: ObjectId[] | null;
  mates: ObjectId[] | null;
  births: ObjectId[] | null;
}

export type ClientDog = Omit<WithId<DatabaseDog>, 'litterId' | 'reproductiveHistory' | 'diagnosticIds' | 'treatmentIds' | 'healthCertificateIds'> & {
  litterData: HistoryRecord & { verified: boolean } | null;
  diagnostics: HistoryRecord[] | null;
  treatments: HistoryRecord[] | null;
  vaccinations: HistoryRecord[] | null;
  healthCertificates: HistoryRecord[] | null;
  reproductiveHistory: ClientReproductiveHistory;
  creatorProfileName: string;
  ownerProfileName: string | null;
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

export type RawOtherDogFields =
  | 'fullName'
  | 'dateOfBirth'
  | 'dateOfDeath'
  | 'gender'
  | 'color'
  | 'isNeutered'

export type RawOtherDogData = Pick <DatabaseDog, RawOtherDogFields> & {
  litterId: string,
  breedId: string,
}

type NonNullableClientDogFields = 'permissions' | 'reproductiveHistory' | 'creatorProfileId' | 'gender' | 'dateOfBirth' | 'creatorProfileName'

export type ProtectedClientDogData = Omit<ClientDog, NonNullableClientDogFields>
  & {
  permissions: ProfilePermissionsByEntity | null,
  reproductiveHistory: {litters: HistoryRecord[] | null},
  creatorProfileId: ObjectId | null,
  gender: GENDER | null,
  ownerProfileName: string | null,
  creatorProfileName: string | null,
  dateOfBirth: string | null,
}
