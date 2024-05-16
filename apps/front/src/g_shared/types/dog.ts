export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

// export enum DOG_TYPES {
//   PUPPY = 'PUPPY',
//   DOG = 'DOG',
//   MALE_DOG = 'MALE_DOG',
//   FEMALE_DOG = 'FEMALE_DOG',
// }

export type Puppy = { // в момент добавления щенка у него может не быть ни полной клички, ни документов
  profileId: string; // либо ID добавившего человека,  либо ID владельца (зависит от поля isLinkedToOwner)
  litterId: string | null; // когда собаку добавляем к уже имеющемуся помету
  litterTitle: string | null; // дата и клички родителей
  breed: string | null;
  gender: GENDER;
  dateOfBirth: string;
  color: string | null;
  name: string | null; // домашняя кличка (может быть даже цвет ошейника)
  fullName: string | null; // имя как в документах (null на случай когда добавляют щенков вместе с пометом)
  puppyCardId: string | null; // ссылка на документ (щенячку)
  puppyCardNumber: string | null;
  microchipNumber: string | null;
  tattooNumber: string | null;
}

export type NewDog = Puppy & { // взрослой собаке (не принадлежащей пользователю) добавляется номер родословной и полная кличка
  pedigreeNumber: string | null;
  isNeutered: boolean | null; // данные о кастрации, null для собак, у которых isLinkedToOwner: false
}

export type NewDogFormFields = 'name' | 'fullName' | 'dateOfBirth' | 'breed' |
  'gender' | 'microchipNumber' | 'tattooNumber' | 'color' | 'pedigreeNumber' | 'isNeutered'

type PuppyReproductiveHistory = {
  heatIds: null;
  mateIds: null;
  pregnancyIds: null;
  birthIds: null;
  litterIds: null;
  litters: null;
}

type MaleReproductiveHistory = {
  heatIds: null;
  mateIds: HistoryRecord[];
  pregnancyIds: null;
  birthIds: null;
  litterIds: HistoryRecord[];
  litters: HistoryRecord[];
}

type FemaleReproductiveHistory = {
  heatIds: HistoryRecord[];
  mateIds: HistoryRecord[];
  pregnancyIds: HistoryRecord[];
  birthIds: HistoryRecord[];
  litterIds: HistoryRecord[];
  litters: HistoryRecord[];
}

type DogReproductiveHistory = {
  heatIds: null;
  mateIds: null;
  pregnancyIds: null;
  birthIds: null;
  litterIds: HistoryRecord[];
  litters: HistoryRecord[];
}

export type ReproductiveHistory = PuppyReproductiveHistory | MaleReproductiveHistory | FemaleReproductiveHistory | DogReproductiveHistory

export type DogData = NewDog & {
  _id: string;
  isLinkedToOwner: boolean;
  diagnostics: string[] | null;
  treatments: HistoryRecord[] | null;
  vaccinations: HistoryRecord[] | null;
  pedigreeId: string | null;
  reproductiveHistory: ReproductiveHistory
}

export type DogsStorage = {
  dogsData: DogData[]
  setDogsData: (dogsData: DogData[]) => void,
}

export type BaseDogInfo = {
  litterId: string | null;
  litterTitle: string | null;
  breed: string | null;
  gender: GENDER;
  dateOfBirth: string;
  color: string | null;
  name: string | null;
  fullName: string | null;
  microchipNumber: string | null;
  pedigreeNumber: string | null;
  tattooNumber: string | null;
  isNeutered: boolean | null;
}

// export type ExternalDogs =

export type HistoryRecord = {
  id: string,
  title: string,
  date?: string[]
}

// type CommonClientDogFields = 'profileId' | 'litterId' | 'isLinkedToOwner' | 'breed' | 'gender'
//   | 'dateOfBirth' | 'name' | 'color' | 'puppyCardId' | 'puppyCardNumber' | 'microchipNumber' | 'tattooNumber'
//   | 'fullName' | 'isNeutered' | 'type' | 'pedigreeNumber' | 'pedigreeId'

// type ClientDog = Pick<DatabaseDog, CommonClientDogFields> & {
//   litterTitle: string
//   diagnostics: null | string[] | HistoryRecord[];
//   treatments: null | string[] | HistoryRecord[];
//   reproductiveHistory: {
//     litters: null | HistoryRecord[];
//     heats: null | string[] | HistoryRecord[];
//     mates: null | string[] | HistoryRecord[];
//     births: null | string[] | HistoryRecord[];
//   }
// }
