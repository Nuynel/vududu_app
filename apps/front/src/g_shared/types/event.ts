export enum DATA_TYPES {
  PLANNED = 'PLANNED',
  HISTORY = 'HISTORY'
}

export enum EVENT_TYPE {
  VACCINATION = 'VACCINATION',
  ANTIPARASITIC_TREATMENT = 'ANTIPARASITIC_TREATMENT',
  // DIAGNOSTICS = 'DIAGNOSTICS',
  HEAT = 'HEAT',
  // MATE = 'MATE',
  // PREGNANCY = 'PREGNANCY',
  // BIRTH = 'BIRTH',
  // REGISTRATION = 'REGISTRATION',
  // DOG_SHOW = 'DOG_SHOW',
  // COMPETITION = 'COMPETITION',
}

export type IncomingEventData = {
  _id: string,

  profileId: string,
  dogId: string,
  eventType: EVENT_TYPE,
  comments: string | null,

  date: string[],

  activated: boolean,
  validity: number | null,
  medication: string | null,

  documentId: string | null,
}

export type RawTreatmentFields =
  | 'date'
  | 'activated'
  | 'comments'
  | 'validity'
  | 'medication'
  | 'profileId'
  | 'dogId'

export type OutgoingTreatmentData = Pick<IncomingEventData, RawTreatmentFields> & {
  eventType: EVENT_TYPE.ANTIPARASITIC_TREATMENT | EVENT_TYPE.VACCINATION
}

export type RawHeatFields =
  | 'date'
  | 'activated'
  | 'comments'
  | 'profileId'
  | 'dogId'

export type OutgoingHeatData = Pick<IncomingEventData, RawHeatFields> & {
  eventType: EVENT_TYPE.HEAT
}
