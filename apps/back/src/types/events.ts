import {ObjectId} from "mongodb";
// Events

export enum EVENT_TYPE {
  ANTIPARASITIC_TREATMENT = 'ANTIPARASITIC_TREATMENT',
  VACCINATION = 'VACCINATION',
  DIAGNOSTICS = 'DIAGNOSTICS',
  HEAT = 'HEAT',
  MATE = 'MATE',
  PREGNANCY = 'PREGNANCY',
  BIRTH = 'BIRTH',
  REGISTRATION = 'REGISTRATION',
  DOG_SHOW = 'DOG_SHOW',
  COMPETITION = 'COMPETITION',
}

export enum EVENT_STATUSES {
  PLANNED = 'PLANNED',
  ARCHIVED = 'ARCHIVED',
}

type EventsDate = string[] | null;

export enum TREATMENT_TYPE {
  ANTIPARASITIC = 'ANTIPARASITIC',
  VACCINATION = 'VACCINATION'
}

type ConnectedEvents = {
  heat: ObjectId | null;
  mate: ObjectId | null;
  pregnancy: ObjectId | null;
  birth: ObjectId | null;
  registration: ObjectId | null;
}

type Event = {
  profileId: ObjectId;
  date: EventsDate;
  activated: boolean;
  comments: string | null;
}

type DogsEvent = Event & { dogId: ObjectId }

// Антипаразитарная обработка
export type AntiparasiticTreatment = DogsEvent & {
  validity: number | null;
  medication: string | null;
  eventType: EVENT_TYPE.ANTIPARASITIC_TREATMENT
}

// Вакцинация
export type Vaccination = DogsEvent & {
  validity: number | null;
  medication: string | null;
  eventType: EVENT_TYPE.VACCINATION;
}

// Диагностика
export type Diagnostics = DogsEvent & {
  documentId: ObjectId | null; // заключения и результаты исследований
  diagnosticsType: string | null;
  vet: string | null;
  eventType: EVENT_TYPE.DIAGNOSTICS
}

// Течка
export type Heat = DogsEvent & {
  eventType: EVENT_TYPE.HEAT;
  connectedEvents: Pick<ConnectedEvents, 'mate'>;
}

// Вязка
export type Mate = DogsEvent & {
  connectedEvents: Pick<ConnectedEvents, 'heat' | 'pregnancy' | 'birth'>
  partnerId: ObjectId;
  documentId: ObjectId | null; // акт вязки
  eventType: EVENT_TYPE.MATE
}

// хорошо бы автоматически к беременности подтягивать все обработки,
// которые были у суки вплоть до 3 мес до беременности
// так же сюда надо автоматически подтягивать все исследования,
// которые были у суки в период беременности
export type Pregnancy = DogsEvent & {
  connectedEvents: Pick<ConnectedEvents, 'heat' | 'birth'>
  eventType: EVENT_TYPE.PREGNANCY
}

// Роды
export type Birth = DogsEvent & {
  connectedEvents: Pick<ConnectedEvents, 'heat' | 'pregnancy' | 'registration'>
  litterId: ObjectId | null;
  eventType: EVENT_TYPE.BIRTH
}

// Актирование помёта
export type Registration = DogsEvent & {
  connectedEvents: Pick<ConnectedEvents, 'birth'>
  litterId: ObjectId;
  documentId: ObjectId | null;
  eventType: EVENT_TYPE.REGISTRATION
}

export type DogShow = Event & {}

export type DatabaseEvent = AntiparasiticTreatment | Vaccination | Heat | Diagnostics | Mate |
  Pregnancy | Birth | Registration

// позже здесь добавятся спортиные состязания, испытания, бонитировки и так далее
