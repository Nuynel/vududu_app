import {HistoryRecord} from "./index";

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum DOG_TYPES {
  PUPPY = 'PUPPY',
  DOG = 'DOG',
  MALE_DOG = 'MALE_DOG',
  FEMALE_DOG = 'FEMALE_DOG',
}

export type IncomingDogData = {
  _id: string;

  name: string | null;
  fullName: string; // имя как в документах (null на случай когда добавляют щенков вместе с пометом)
  dateOfBirth: string;
  dateOfDeath: string | null;
  breedId: string | null;
  gender: GENDER | null;
  microchipNumber: string | null;
  tattooNumber: string | null;
  pedigreeNumber: string | null;
  color: string | null;
  isNeutered: boolean | null;

  creatorProfileId: string | null;
  ownerProfileId: string | null;
  breederProfileId: string | null;
  federationId: string | null;

  puppyCardId: string | null; // ссылка на документ (щенячку)
  puppyCardNumber: string | null;
  type: DOG_TYPES;
  pedigreeId: string | null;

  litterData: HistoryRecord | null;
  diagnostics: HistoryRecord[] | null;
  treatments: HistoryRecord[] | null;
  vaccinations: HistoryRecord[] | null;
  healthCertificates: HistoryRecord[] | null;
  reproductiveHistory: {
    litters: HistoryRecord[] | null;
    heats: string[] | null;
    mates: string[] | null;
    births: string[] | null;
  } | null
  permissions: Permissions | null;
  ownerProfileName: string | null,
  creatorProfileName: string | null,
}

export type RawDogFields =
  | 'name'
  | 'fullName'
  | 'dateOfBirth'
  | 'dateOfDeath'
  | 'breedId'
  | 'gender'
  | 'microchipNumber'
  | 'tattooNumber'
  | 'pedigreeNumber'
  | 'color'
  | 'isNeutered'

export type OutgoingDogData = Pick<IncomingDogData, RawDogFields> & {
  litterId: string | null;
}

export type DogsStorage = {
  dogsData: IncomingDogData[]
  setDogsData: (dogsData: IncomingDogData[]) => void,
}
