import { DecodedToken } from "./token";
import { User, UserData } from "./user";
import { ProfileData, ProfileStorage, ConnectedOrganisations, KennelConnectedOrganizations, BreederConnectedOrganizations } from "./profile";
import { IncomingDogData, OutgoingDogData, DogsStorage, RawDogFields } from "./dog";
import { IncomingLitterData, OutgoingLitterData, LittersStore, RawLitterFields } from "./litter";
import {
  Event,
  Treatment,
  Heat,
  NewEventFormField,
  NewHeatFormFields,
  NewTreatmentFormFields,
  EventData,
} from './event'
import {FieldData, BlocksConfig} from './components'
import {Pedigree} from './pedigrees'
import {Breed} from "./breed";

type HistoryRecord = {
  id: string,
  title: string | null,
  date?: string[] | null,
}

export {
  DecodedToken,

  User,
  UserData,

  ProfileData,
  ProfileStorage,
  ConnectedOrganisations,
  BreederConnectedOrganizations,
  KennelConnectedOrganizations,

  IncomingDogData,
  OutgoingDogData,
  DogsStorage,
  RawDogFields,

  HistoryRecord,

  IncomingLitterData,
  OutgoingLitterData,
  LittersStore,
  RawLitterFields,

  Event,
  Treatment,
  Heat,
  NewEventFormField,
  NewHeatFormFields,
  NewTreatmentFormFields,
  EventData,

  FieldData,
  BlocksConfig,

  Pedigree,

  Breed,
}
