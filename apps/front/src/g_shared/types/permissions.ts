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
      profileIds: string[]
    };
    [DATA_GROUPS.PRIVATE]: {
      group: null,
      profileIds: string[]
    };
  }
  editors: {
    [DATA_GROUPS.PUBLIC]: string[];
    [DATA_GROUPS.PROTECTED]: string[];
    [DATA_GROUPS.PRIVATE]: string[];
  }
}
