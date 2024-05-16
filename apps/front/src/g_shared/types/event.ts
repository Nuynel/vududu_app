type EventsDate = string[];

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

type ConnectedEvents = {
  heat: string | null;
  mate: string | null;
  pregnancy: string | null;
  birth: string | null;
  registration: string | null;
}

export type Event = {
  // profileId: string;
  date: EventsDate;
  comments: string | null;
  eventType: EVENT_TYPE;
  activated: boolean;
  _id: string;
}

type DogsEvent = Event & { dogId: string }

export type Treatment = DogsEvent & {
  validity: number;
  medication: string;
  eventType: EVENT_TYPE.ANTIPARASITIC_TREATMENT | EVENT_TYPE.VACCINATION
}

export type Heat = DogsEvent & {
  eventType: EVENT_TYPE.HEAT;
  connectedEvents: Pick<ConnectedEvents, 'mate'>
}

export type NewEventFormField = 'eventType'

export type NewHeatFormFields = 'dogId' | 'date' | 'comments'

export type NewTreatmentFormFields = 'dogId' | 'date' | 'comments' | 'validity' | 'medication'

export type EventData = Heat | Treatment
