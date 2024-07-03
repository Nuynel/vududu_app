import {ObjectId} from 'mongodb'

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
      group: PERMISSION_GROUPS.REGISTERED | PERMISSION_GROUPS.ALL,
      profileIds: null
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
    [DATA_GROUPS.PUBLIC]: ObjectId[];
    [DATA_GROUPS.PROTECTED]: ObjectId[];
    [DATA_GROUPS.PRIVATE]: ObjectId[];
  }
}

export const DogDataGroups = {
  [DATA_GROUPS.PUBLIC]: [
    'name',
    'fullName',
    'breedId',
    'dateOfBirth',
    'dateOfDeath',
    'gender',
    'color',
    'reproductiveHistory', // .litterIds
    'federationId',
    'ownerProfileId',
    'isNeutered',
    'litterId',
  ],
  [DATA_GROUPS. PROTECTED]: [
    'microchipNumber',
    'tattooNumber',
    'pedigreeNumber',
    'pedigreeId',
    'breederProfileId',
    'healthCertificatesIds',
  ],
  [DATA_GROUPS.PRIVATE]: [
    'puppyCardNumber',
    'puppyCardId',
    'diagnosticIds',
    'creatorProfileId',
    'treatmentIds',
  ]
} as const

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
