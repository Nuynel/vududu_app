import { DecodedToken } from "./token";
import { User, UserData } from "./user";
import { ProfileData, ProfileStorage, ConnectedOrganisations, KennelConnectedOrganizations, BreederConnectedOrganizations } from "./profile";
import { IncomingDogData, OutgoingDogData, DogsStorage, RawDogFields } from "./dog";
import { IncomingLitterData, OutgoingLitterData, LittersStore, RawLitterFields } from "./litter";
import {
  IncomingEventData,
  RawHeatFields,
  RawTreatmentFields,
  OutgoingHeatData,
  OutgoingTreatmentData,
} from './event'
import {FieldData, BlocksConfig} from './components'
import {Pedigree} from './pedigrees'
import {Breed} from "./breed";
import {Permissions} from "./permissions";

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

  IncomingEventData,
  RawHeatFields,
  RawTreatmentFields,
  OutgoingHeatData,
  OutgoingTreatmentData,

  FieldData,
  BlocksConfig,

  Pedigree,

  Breed,

  Permissions,
}
