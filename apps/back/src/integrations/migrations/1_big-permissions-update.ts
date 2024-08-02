import {COLLECTIONS, DB_NAME} from "../../constants";
import {DATA_GROUPS, DOG_TYPES, PERMISSION_GROUPS} from "../../types";
import {MongoClient} from "mongodb";

const permissions = {
  viewers: {
    [DATA_GROUPS.PUBLIC]: {
      group: PERMISSION_GROUPS.REGISTERED,
      profileIds: [],
    },
    [DATA_GROUPS.PROTECTED]: {
      group: PERMISSION_GROUPS.ORGANISATION,
      profileIds: [],
    },
    [DATA_GROUPS.PRIVATE]: {
      group: null,
      profileIds: [],
    }
  },
  editors: {
    [DATA_GROUPS.PUBLIC]: {
      group: null,
      profileIds: []
    },
    [DATA_GROUPS.PROTECTED]: {
      group: null,
      profileIds: []
    },
    [DATA_GROUPS.PRIVATE]: {
      group: null,
      profileIds: []
    },
  }
}

export const up = async (client: MongoClient) => {
  console.log('!!! start migration UP -big_permissions_update- !!!')
  const dogs_migration_result = await client.db(DB_NAME).collection(COLLECTIONS.DOGS).updateMany(
    {},
    {
      $set: {
        federationId: null,
        healthCertificateIds: null,
        permissions: permissions,
        schema_version: 1,
      },
      $unset: {
        type: ''
      }
    }
  );
  console.log('dogs_migration_result => ', dogs_migration_result)
  const litters_migration_result = await client.db(DB_NAME).collection(COLLECTIONS.LITTERS).updateMany(
    {},
    {
      $rename: { 'profileId': 'creatorProfileId' },
      $set: {
        federationId: null,
        puppiesCount: {
          male: null,
          female: null
        },
        verified: {
          status: false
        },
        schema_version: 1,
      }
    }
  );
  console.log('litters_migration_result => ', litters_migration_result)
  const profiles_migration_result = await client.db(DB_NAME).collection(COLLECTIONS.PROFILES).updateMany(
    {},
    {
      $rename: { 'dogIds': 'ownDogIds' },
      $set: {
        otherDogIds: [],
        otherLitterIds: [],
        schema_version: 1,
      }
    }
  );
  console.log('profiles_migration_result => ', profiles_migration_result)
}

export const down = async (client: MongoClient) => {
  console.log('!!! start migration DOWN -big_permissions_update- !!!')
  const dogs_migration_result = await client.db(DB_NAME).collection(COLLECTIONS.DOGS).updateMany(
    {},
    {
      $set: {
        type: DOG_TYPES.MALE_DOG,
      },
      $unset: {
        federationId: null,
        healthCertificateIds: null,
        permissions: permissions,
        schema_version: 1,
      }
    }
  );
  console.log('dogs_migration_result => ', dogs_migration_result)
  const litters_migration_result = await client.db(DB_NAME).collection(COLLECTIONS.LITTERS).updateMany(
    {},
    {
      $rename: { 'creatorProfileId': 'profileId' },
      $unset: {
        federationId: '',
        puppiesCount: '',
        verified: '',
        schema_version: 1,
      }
    }
  );
  console.log('litters_migration_result => ', litters_migration_result)
  const profiles_migration_result = await client.db(DB_NAME).collection(COLLECTIONS.PROFILES).updateMany(
    {},
    {
      $rename: { 'ownDogIds': 'dogIds' },
      $unset: {
        otherDogIds: '',
        otherLitterIds: '',
        schema_version: 1,
      }
    }
  );
  console.log('profiles_migration_result => ', profiles_migration_result)
}
