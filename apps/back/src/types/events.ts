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

type EventsDate = string[] | null; //todo нахуя тут null??

export enum TREATMENT_TYPE {
  ANTIPARASITIC = 'ANTIPARASITIC',
  VACCINATION = 'VACCINATION'
}

export type DatabaseDogEvent = {
  profileId: ObjectId;
  date: EventsDate;
  activated: boolean;
  comments: string | null;
  eventType: EVENT_TYPE

  dogId: ObjectId;

  validity: number | null;
  medication: string | null;
  documentId: ObjectId | null; // заключения и результаты исследований // акт вязки
  diagnosticsType: string | null;
  vet: string | null;
  partnerId: ObjectId | null;
  litterId: ObjectId | null;
}

// Антипаразитарная обработка

export type RawTreatmentFields =
  | 'date'
  | 'activated'
  | 'comments'
  | 'validity'
  | 'medication'

export type RawAntiparasiticTreatmentData = Pick<DatabaseDogEvent, RawTreatmentFields> & {
  profileId: string,
  dogId: string,
  eventType: EVENT_TYPE.ANTIPARASITIC_TREATMENT
}

export type ClientAntiparasiticTreatment = Pick<DatabaseDogEvent,
  | RawTreatmentFields
  | 'profileId'
  | 'dogId'
> & {
  eventType: EVENT_TYPE.ANTIPARASITIC_TREATMENT;

  documentId: null;
  diagnosticsType: null;
  vet: null;
  partnerId: null;
  litterId: null;
}

// Вакцинация

export type RawVaccinationData = Pick<DatabaseDogEvent, RawTreatmentFields> & {
  profileId: string,
  dogId: string,
  eventType: EVENT_TYPE.VACCINATION
}

export type ClientVaccination = Pick<DatabaseDogEvent,
  | RawTreatmentFields
  | 'profileId'
  | 'dogId'
> & {
  eventType: EVENT_TYPE.VACCINATION;

  documentId: null;
  diagnosticsType: null;
  vet: null;
  partnerId: null;
  litterId: null;
}

// Диагностика
export type RawDiagnosticsFields =
  | 'date'
  | 'activated'
  | 'comments'
  | 'diagnosticsType'
  | 'vet'

export type RawDiagnosticsData = Pick<DatabaseDogEvent, RawDiagnosticsFields> & {
  profileId: string,
  dogId: string,
  documentId: string,
  eventType: EVENT_TYPE.DIAGNOSTICS
}

export type ClientDiagnostics = Pick<DatabaseDogEvent,
  | RawDiagnosticsFields
  | 'profileId'
  | 'dogId'
  | 'documentId'
> & {
  eventType: EVENT_TYPE.DIAGNOSTICS
}

// Течка
export type RawHeatFields =
  | 'date'
  | 'activated'
  | 'comments'

export type RawHeatData = Pick<DatabaseDogEvent, RawHeatFields> & {
  profileId: string,
  dogId: string,
  eventType: EVENT_TYPE.HEAT,
}

export type ClientHeat = Pick<DatabaseDogEvent,
  | RawHeatFields
  | 'profileId'
  | 'dogId'
> & {
  eventType: EVENT_TYPE.HEAT,

  validity: null;
  medication: null;
  documentId: null;
  diagnosticsType: null;
  vet: null;
  partnerId: null;
  litterId: null;
}

// // Вязка
// export type ClientMate = Pick<DatabaseDogEvent,
//   | 'profileId'
//   | 'date'
//   | 'activated'
//   | 'comments'
//   | 'dogId'
//   | 'documentId'
// > & {
//   eventType: EVENT_TYPE.HEAT
//   connectedEvents: Pick<ConnectedEvents, 'heat' | 'pregnancy' | 'birth'>
//   partnerId: ObjectId;
// }
//
// // хорошо бы автоматически к беременности подтягивать все обработки,
// // которые были у суки вплоть до 3 мес до беременности
// // так же сюда надо автоматически подтягивать все исследования,
// // которые были у суки в период беременности
// export type ClientPregnancy = Pick<DatabaseDogEvent,
//   | 'profileId'
//   | 'date'
//   | 'activated'
//   | 'comments'
//   | 'dogId'
// > & {
//   connectedEvents: Pick<ConnectedEvents, 'heat' | 'birth'>
//   eventType: EVENT_TYPE.PREGNANCY
// }
//
// // Роды
// export type ClientBirth = Pick<DatabaseDogEvent,
//   | 'profileId'
//   | 'date'
//   | 'activated'
//   | 'comments'
//   | 'dogId'
// > & {
//   connectedEvents: Pick<ConnectedEvents, 'heat' | 'pregnancy' | 'registration'>
//   litterId: ObjectId | null;
//   eventType: EVENT_TYPE.BIRTH
// }
//
// // Актирование помёта
// export type ClientRegistration = Pick<DatabaseDogEvent,
//   | 'profileId'
//   | 'date'
//   | 'activated'
//   | 'comments'
//   | 'dogId'
//   | 'documentId'
// > & {
//   eventType: EVENT_TYPE.REGISTRATION
//   connectedEvents: Pick<ConnectedEvents, 'birth'>
//   litterId: ObjectId;
// }

// позже здесь добавятся спортиные состязания, испытания, бонитировки и так далее
