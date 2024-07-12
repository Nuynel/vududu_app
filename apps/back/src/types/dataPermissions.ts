import {ObjectId} from 'mongodb'
import {FIELDS_NAMES} from "../constants";
import {ClientDog} from "./dog";

export enum PERMISSION_GROUPS {
  ORGANISATION = 'organisation',
  REGISTERED = 'registered',
  ALL = 'all'
}

export enum DATA_GROUPS {
  PUBLIC = 'public', // доступны всем или только зарегистрированным
  PROTECTED = 'protected', // самая широкая настройка видимости (как по группам, так и индивидуально)
  PRIVATE = 'private' // можно дать доступ только некоторым людям
}

export type Permissions = {
  viewers: {
    [DATA_GROUPS.PUBLIC]: {
      group: PERMISSION_GROUPS.ORGANISATION | PERMISSION_GROUPS.REGISTERED | PERMISSION_GROUPS.ALL | null,
      profileIds: ObjectId[]
    };
    [DATA_GROUPS.PROTECTED]: {
      group: PERMISSION_GROUPS.ORGANISATION | PERMISSION_GROUPS.REGISTERED | PERMISSION_GROUPS.ALL | null,
      profileIds: ObjectId[]
    };
    [DATA_GROUPS.PRIVATE]: {
      group: null,
      profileIds: ObjectId[]
    };
  }
  editors: {
    [DATA_GROUPS.PUBLIC]: {
      group: null,
      profileIds: ObjectId[]
    };
    [DATA_GROUPS.PROTECTED]: {
      group: null,
      profileIds: ObjectId[]
    };
    [DATA_GROUPS.PRIVATE]: {
      group: null,
      profileIds: ObjectId[]
    };
  }
}

export type ProfilePermissionsByDog = {
  view: {
    [DATA_GROUPS.PUBLIC]: boolean;
    [DATA_GROUPS.PROTECTED]: boolean;
    [DATA_GROUPS.PRIVATE]: boolean;
  }
  edit: {
    [DATA_GROUPS.PUBLIC]: boolean;
    [DATA_GROUPS.PROTECTED]: boolean;
    [DATA_GROUPS.PRIVATE]: boolean;
  }
}

export const DogDataGroups = {
  [DATA_GROUPS.PUBLIC]: [
    'name',
    'fullName',
    'dateOfBirth',
    'dateOfDeath',
    'breedId',
    'gender',
    'color',
    'isNeutered',
    'ownerProfileId',
    'federationId',
    'litterData', 'litterId',
    'reproductiveHistory',
    '_id',
  ],
  [DATA_GROUPS.PROTECTED]: [
    'microchipNumber',
    'tattooNumber',
    'pedigreeNumber',
    'pedigreeId',
    'breederProfileId',
    'healthCertificates',
    'healthCertificateIds',
  ],
  [DATA_GROUPS.PRIVATE]: [
    'puppyCardNumber',
    'puppyCardId',
    'diagnostics', 'diagnosticIds',
    'creatorProfileId',
    'treatments', 'treatmentIds',
    'vaccinations',
  ]
} as const

export const DogDataGroupsByFieldName: Record<keyof Omit<ClientDog, 'permissions'>, DATA_GROUPS> = {
  [FIELDS_NAMES.NAME]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.FULL_NAME]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.DATE_OF_BIRTH]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.DATE_OF_DEATH]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.BREED_ID]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.GENDER]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.COLOR]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.IS_NEUTERED]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.OWNER_PROFILE_ID]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.FEDERATION_ID]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.LITTER_DATA]: DATA_GROUPS.PUBLIC,
  // [FIELDS_NAMES.LITTER_ID]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.REPRODUCTIVE_HISTORY]: DATA_GROUPS.PUBLIC,
  [FIELDS_NAMES.ID]: DATA_GROUPS.PUBLIC,

  [FIELDS_NAMES.MICROCHIP_NUMBER]: DATA_GROUPS.PROTECTED,
  [FIELDS_NAMES.TATTOO_NUMBER]: DATA_GROUPS.PROTECTED,
  [FIELDS_NAMES.PEDIGREE_NUMBER]: DATA_GROUPS.PROTECTED,
  [FIELDS_NAMES.PEDIGREE_ID]: DATA_GROUPS.PROTECTED,
  [FIELDS_NAMES.BREEDER_PROFILE_ID]: DATA_GROUPS.PROTECTED,
  [FIELDS_NAMES.HEALTH_CERTIFICATES]: DATA_GROUPS.PROTECTED,
  // [FIELDS_NAMES.HEALTH_CERTIFICATE_IDS]: DATA_GROUPS.PROTECTED,

  [FIELDS_NAMES.PUPPY_CARD_NUMBER]: DATA_GROUPS.PRIVATE,
  [FIELDS_NAMES.PUPPY_CARD_ID]: DATA_GROUPS.PRIVATE,
  // [FIELDS_NAMES.DIAGNOSTIC_IDS]: DATA_GROUPS.PRIVATE,
  [FIELDS_NAMES.DIAGNOSTICS]: DATA_GROUPS.PRIVATE,
  [FIELDS_NAMES.CREATOR_PROFILE_ID]: DATA_GROUPS.PRIVATE,
  // [FIELDS_NAMES.TREATMENT_IDS]: DATA_GROUPS.PRIVATE,
  [FIELDS_NAMES.TREATMENTS]: DATA_GROUPS.PRIVATE,
  [FIELDS_NAMES.VACCINATIONS]: DATA_GROUPS.PRIVATE,
}

export const LitterDataGroups = {
  [DATA_GROUPS.PUBLIC]: [
    'creatorProfileId',
    'fatherId',
    'motherId',
    'litterTitle',
    'breedId',
    'dateOfBirth',
    'puppyIds',
    'puppyStatuses',
    'puppiesCount',
    'verified',
    'federationId',
  ],
  [DATA_GROUPS.PROTECTED]: [

  ],
  [DATA_GROUPS.PRIVATE]: [
    'comments'
  ]
} as const
