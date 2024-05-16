import {ObjectId} from "mongodb";

// todo подумать должен ли быть список пометов у питомника и заводчика,
//  или же им хватит историй пометов их собак

type ConnectedOrganisations = {
  canineFederation: ObjectId | string | null;
  nationalBreedClub: ObjectId | string | null;
  canineClub: ObjectId | string | null;
  kennel: ObjectId | string | null;
  breeder: ObjectId | string | null;

  kennelFederationIds: ObjectId[] | null;
  nationalBreedClubIds: ObjectId[];
  canineClubIds: ObjectId[];
  kennelIds: ObjectId[];
  breederIds: ObjectId[];
  maleDogOwnerIds: ObjectId[];
}

type Permissions = {}

type Payments = {}

export type NewUser = {
  email: string;
  password: string;
}

export type User = NewUser & {
  activator: string;
  isActivated: boolean;
  isBanned: boolean;
  createdAt: string;
  profileIds: ObjectId[];
  activeProfileId: ObjectId | string | null;
  // добавить список пройденного онбординга?
}

type Profile = {
  userId: ObjectId;
  name: string;
  payments: Payments;
  permissions: Permissions;
  documentIds: ObjectId[];
  contactIds: ObjectId[];
  eventIds: ObjectId[];
  // добавить список пройденного онбординга?
}

export enum PROFILE_TYPES {
  CANINE_FEDERATION = 'CANINE_FEDERATION',
  NATIONAL_BREED_CLUb = 'NATIONAL_BREED_CLUb',
  CANINE_CLUB = 'CANINE_CLUB',
  KENNEL = 'KENNEL',
  BREEDER = 'BREEDER',
  MALE_DOG_OWNER = 'MALE_DOG_OWNER',
}

type CanineFederationConnectedOrganizations =
  'canineFederation' |
  'nationalBreedClubIds' | 'canineClubIds' | 'kennelIds'
type NationalBreedClubConnectedOrganizations =
  'canineFederation' |
  'canineClubIds' | 'kennelIds' | 'breederIds'
type CanineClubConnectedOrganizations =
  'canineFederation' | 'nationalBreedClub' |
  'kennelIds' | 'breederIds' | 'maleDogOwnerIds'
type KennelConnectedOrganizations =
  'canineFederation' | 'nationalBreedClub' | 'canineClub' |
  'breederIds' | 'maleDogOwnerIds'
type BreederConnectedOrganizations =
  'canineFederation' | 'nationalBreedClub' | 'canineClub' | 'kennel' |
  'maleDogOwnerIds'
type MaleDogOwnerConnectedOrganizations =
  'canineFederation' | 'nationalBreedClub' | 'canineClub' | 'kennel' | 'breeder'

export type CanineFederationProfile = Profile & { // кинологические федерации
  connectedOrganisations: Pick<ConnectedOrganisations, CanineFederationConnectedOrganizations>;
  type: PROFILE_TYPES.CANINE_FEDERATION
}

export type NationalBreedClubProfile = Profile & { // национальные породные клубы
  connectedOrganisations: Pick<ConnectedOrganisations, NationalBreedClubConnectedOrganizations>;
  type: PROFILE_TYPES.NATIONAL_BREED_CLUb
}

export type CanineClubProfile =  Profile & { // кинологические клубы
  connectedOrganisations: Pick<ConnectedOrganisations, CanineClubConnectedOrganizations>;
  type: PROFILE_TYPES.CANINE_CLUB
}

export type KennelProfile = Profile & { // питомники
  connectedOrganisations: Pick<ConnectedOrganisations, KennelConnectedOrganizations>;
  dogIds: ObjectId[];
  litterIds: ObjectId[];
  type: PROFILE_TYPES.KENNEL
}

export type BreederProfile = Profile & { // заводчики
  connectedOrganisations: Pick<ConnectedOrganisations, BreederConnectedOrganizations>;
  dogIds: ObjectId[];
  litterIds: ObjectId[];
  type: PROFILE_TYPES.BREEDER
}

export type MaleDogOwnerProfile = Profile & { // хозяева кобелей
  connectedOrganisations: Pick<ConnectedOrganisations, MaleDogOwnerConnectedOrganizations>;
  dogIds: ObjectId[];
  type: PROFILE_TYPES.MALE_DOG_OWNER
}

export type ConnectedOrganisationsTypes =
  Pick<ConnectedOrganisations, CanineFederationConnectedOrganizations> |
  Pick<ConnectedOrganisations, NationalBreedClubConnectedOrganizations> |
  Pick<ConnectedOrganisations, CanineClubConnectedOrganizations> |
  Pick<ConnectedOrganisations, KennelConnectedOrganizations> |
  Pick<ConnectedOrganisations, BreederConnectedOrganizations> |
  Pick<ConnectedOrganisations, MaleDogOwnerConnectedOrganizations>

export type DatabaseProfile = CanineFederationProfile | NationalBreedClubProfile |
  CanineClubProfile | KennelProfile | BreederProfile | MaleDogOwnerProfile
