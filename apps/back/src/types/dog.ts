import {ObjectId} from "mongodb";

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

export type BaseDogData = { // в момент добавления щенка у него может не быть ни полной клички, ни документов
  profileId: ObjectId | string; // либо ID добавившего человека,  либо ID владельца (зависит от поля isLinkedToOwner)
  litterId: ObjectId | string | null; // когда собаку добавляем к уже имеющемуся помету
  isLinkedToOwner: boolean;
  breedId: ObjectId | null;
  gender: GENDER;
  dateOfBirth: string;
  // dateOfDeath: string;
  name: string | null; // домашняя кличка (может быть даже цвет ошейника)
  color: string | null;
  puppyCardId: ObjectId | string | null; // ссылка на документ (щенячку)
  puppyCardNumber: string | null;
  microchipNumber: string | null;
  tattooNumber: string | null;
  fullName: string | null; // имя как в документах (null на случай когда добавляют щенков вместе с пометом)
  isNeutered: boolean | null; // данные о кастрации, null для собак, у которых isLinkedToOwner: false
}

export type Puppy = BaseDogData & {
  type: DOG_TYPES.PUPPY;
  reproductiveHistory: PuppyReproductiveHistory;
  pedigreeNumber: null;
  pedigreeId: null;
  treatmentIds: null;
  diagnosticIds: null;
}

export type NewDog = BaseDogData & { // взрослой собаке (не принадлежащей пользователю) добавляется номер родословной и полная кличка
  pedigreeNumber: string | null;
  pedigreeId: null;
}

export type Dog = NewDog & { // в базу данных взрослая собака добавляется с пустым списком пометов в репр. истории
  reproductiveHistory: DogReproductiveHistory;
  type: DOG_TYPES.DOG;
  treatmentIds: null;
  diagnosticIds: null;
  // isLinkedToOwner: false;
}

export type ExtendedDog = NewDog & {
  diagnosticIds: ObjectId[]; // автоматически добавляется при добавлении собаки
  treatmentIds: ObjectId[];
  pedigreeId: ObjectId | null; // ссылка на документ (родуха)
  // isLinkedToOwner: true;
}

export type MaleExtendedDog = ExtendedDog & {
  reproductiveHistory: MaleReproductiveHistory;
  type: DOG_TYPES.MALE_DOG;
}

export type FemaleExtendedDog = ExtendedDog & {
  reproductiveHistory: FemaleReproductiveHistory;
  type: DOG_TYPES.FEMALE_DOG,
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

type DogReproductiveHistory = {
  heatIds: null;
  mateIds: null;
  pregnancyIds: null;
  birthIds: null;
  litterIds: ObjectId[];
}

type PuppyReproductiveHistory = {
  heatIds: null;
  mateIds: null;
  pregnancyIds: null;
  birthIds: null;
  litterIds: null;
}

export type DatabaseDog = Puppy | Dog | MaleExtendedDog | FemaleExtendedDog;

export type BaseDogInfo = Pick<BaseDogData,
  | 'litterId'
  | 'breedId'
  | 'gender'
  | 'dateOfBirth'
  | 'color'
  | 'name'
  | 'fullName'
  | 'microchipNumber'
  | 'tattooNumber'
  | 'isNeutered'
> & {
  litterTitle: string | null;
}
