export enum PROFILE_TYPES {
  CANINE_FEDERATION = 'CANINE_FEDERATION',
  NATIONAL_BREED_CLUb = 'NATIONAL_BREED_CLUb',
  CANINE_CLUB = 'CANINE_CLUB',
  KENNEL = 'KENNEL',
  BREEDER = 'BREEDER',
  MALE_DOG_OWNER = 'MALE_DOG_OWNER',
}

export type ConnectedOrganisations = {
  canineFederation: string | null;
  nationalBreedClub: string | null;
  canineClub: string | null;
  kennel: string | null;
  breeder: string | null;

  kennelFederationIds: string[] | null;
  nationalBreedClubIds: string[];
  canineClubIds: string[];
  kennelIds: string[];
  breederIds: string[];
  maleDogOwnerIds: string[];
}

export type KennelConnectedOrganizations =
  'canineFederation' | 'nationalBreedClub' | 'canineClub'
  // | 'breederIds' | 'maleDogOwnerIds'
export type BreederConnectedOrganizations =
  'canineFederation' | 'nationalBreedClub' | 'canineClub' | 'kennel'
  // | 'maleDogOwnerIds'

export type ProfileData = {
  name: string;
  type: PROFILE_TYPES;
  documentIds: string[];
  contactIds: string[];
  eventIds: string[];
  dogIds: string[];
  litterIds: string[];
  connectedOrganisations: Pick<ConnectedOrganisations, BreederConnectedOrganizations>;
}

export type ProfileStorage = ProfileData & {
  setProfileData: (profileData: ProfileData) => void,
}
