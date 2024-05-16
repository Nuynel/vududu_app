import {
  NewUser,
  User,
  CanineFederationProfile,
  NationalBreedClubProfile,
  CanineClubProfile,
  KennelProfile,
  BreederProfile,
  MaleDogOwnerProfile,
  DatabaseProfile,
  ConnectedOrganisationsTypes,
  PROFILE_TYPES,
} from './user'

import { History, ContactList } from './historyAndList'

import { Contact } from "./contact";
import { Document } from './document';
import { NewLitter, Litter } from "./litter";

import {
  AntiparasiticTreatment,
  Diagnostics,
  Heat,
  Mate,
  Pregnancy,
  Birth,
  Registration,
  DatabaseEvent,
  Vaccination,
  EVENT_TYPE,
  // EVENT_STATUSES,
} from './events'

import {
  Puppy,
  NewDog,
  Dog,
  MaleExtendedDog,
  FemaleExtendedDog,
  DatabaseDog,
  ExtendedDog,
  DOG_TYPES,
  GENDER,
  BaseDogInfo,
  MaleReproductiveHistory,
  FemaleReproductiveHistory,
} from "./dog";

// пользователь связан с одним или несколькими профилями
// есть 6 (пока что) типов профилей: кинологическая федерация, национальный клуб породы, кинологический клуб,
// питомник, заводчик, владелец кобеля

// Как предусмотреть решение вопроса совладения? Например, можно у собаки вместо ссылки на юзера сделать поле ownerIds[]
// В этом поле будут перечислены профили, которые владеют этой собакой. Если собака на совладении,
// то в списке будет минимум 2 профиля. или же сделать это поле OwnerId[[] | OwnerId, тогда если это массив - собака в совладении,
// а если нет, то владелец один.

export {
  NewUser,
  User,
  CanineFederationProfile,
  NationalBreedClubProfile,
  CanineClubProfile,
  KennelProfile,
  BreederProfile,
  MaleDogOwnerProfile,
  DatabaseProfile,
  ConnectedOrganisationsTypes,
  PROFILE_TYPES,

  History,

  ContactList,

  Contact,

  Document,

  NewLitter,
  Litter,

  AntiparasiticTreatment,
  Diagnostics,
  Heat,
  Mate,
  Pregnancy,
  Birth,
  Registration,
  DatabaseEvent,
  Vaccination,
  EVENT_TYPE,
  // EVENT_STATUSES,

  Puppy,
  NewDog,
  Dog,
  MaleExtendedDog,
  FemaleExtendedDog,
  DatabaseDog,
  ExtendedDog,
  DOG_TYPES,
  GENDER,
  BaseDogInfo,
  MaleReproductiveHistory,
  FemaleReproductiveHistory,
}
