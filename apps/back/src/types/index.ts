import {
  NewUser,
  User,
  CanineFederationProfile,
  NationalBreedClubProfile,
  CanineClubProfile,
  KennelProfile,
  BreederProfile,
  DogOwnerProfile,
  DatabaseProfile,
  ConnectedOrganisationsTypes,
  PROFILE_TYPES,
} from './user'

import { History, ContactList } from './historyAndList'

import { Contact } from "./contact";
import { Document } from './document';
import { DatabaseLitter, ClientLitter, RawLitterData } from "./litter";

import {
  DatabaseDogEvent,
  EVENT_TYPE,

  RawDiagnosticsFields,
  RawDiagnosticsData,
  ClientDiagnostics,

  RawTreatmentFields,
  RawAntiparasiticTreatmentData,
  ClientAntiparasiticTreatment,
  RawVaccinationData,
  ClientVaccination,

  RawHeatFields,
  RawHeatData,
  ClientHeat,
  // EVENT_STATUSES,
} from './events'

import {
  DatabaseDog,
  DOG_TYPES,
  GENDER,
  RawDogData,
  PuppyReproductiveHistory,
  DogReproductiveHistory,
  MaleReproductiveHistory,
  FemaleReproductiveHistory,
  ClientDog,
  RawDogFields,

  RawOtherDogFields,
  RawOtherDogData
} from "./dog";

import {Breed, BreedIssue} from "./breed";
import {ObjectId} from "mongodb";

import {
  DATA_GROUPS,
  PERMISSION_GROUPS,
  Permissions,
  DogDataGroups,
  LitterDataGroups,
} from "./dataPermissions";

// IMPORTANT:
// Raw types - all types received from the client side (CLIENT >>> SERVER)
// Database types - all types stored in documents inside the database (>>> DATABASE >>>)
// Client types - all types sent to the client side (SERVER >>> CLIENT)



// пользователь связан с одним или несколькими профилями
// есть 6 (пока что) типов профилей: кинологическая федерация, национальный клуб породы, кинологический клуб,
// питомник, заводчик, владелец кобеля

// Как предусмотреть решение вопроса совладения? Например, можно у собаки вместо ссылки на юзера сделать поле ownerIds[]
// В этом поле будут перечислены профили, которые владеют этой собакой. Если собака на совладении,
// то в списке будет минимум 2 профиля. или же сделать это поле OwnerId[[] | OwnerId, тогда если это массив - собака в совладении,
// а если нет, то владелец один.

// надо поработать с типами: сделать типы для базы, для бэкенда и для клиента, перечислить типы которые помогут приводить одни данные к другим и так далее

type HistoryRecord = {
  id: ObjectId,
  // id: string | ObjectId,
  date: string[] | null,
  title: string | null,
}

export {
  HistoryRecord,

  NewUser,
  User,
  CanineFederationProfile,
  NationalBreedClubProfile,
  CanineClubProfile,
  KennelProfile,
  BreederProfile,
  DogOwnerProfile,
  DatabaseProfile,
  ConnectedOrganisationsTypes,
  PROFILE_TYPES,

  History,

  ContactList,

  Contact,

  Document,

  DatabaseLitter,
  ClientLitter,
  RawLitterData,

  DatabaseDogEvent,
  EVENT_TYPE,

  RawDiagnosticsFields,
  RawDiagnosticsData,
  ClientDiagnostics,

  RawTreatmentFields,
  RawAntiparasiticTreatmentData,
  ClientAntiparasiticTreatment,
  RawVaccinationData,
  ClientVaccination,

  RawHeatFields,
  RawHeatData,
  ClientHeat,

  DatabaseDog,
  DOG_TYPES,
  GENDER,
  RawDogData,
  PuppyReproductiveHistory,
  DogReproductiveHistory,
  MaleReproductiveHistory,
  FemaleReproductiveHistory,
  ClientDog,
  RawDogFields,
  RawOtherDogFields,
  RawOtherDogData,

  Breed,
  BreedIssue,

  DATA_GROUPS,
  PERMISSION_GROUPS,
  Permissions,
  DogDataGroups,
  LitterDataGroups,
}
