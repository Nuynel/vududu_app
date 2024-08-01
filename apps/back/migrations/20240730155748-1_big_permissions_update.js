import {COLLECTIONS} from "../src/constants";
import {DATA_GROUPS, DOG_TYPES, PERMISSION_GROUPS} from "../src/types";

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

module.exports = {
  async up(db, client) {
    console.log('!!! start migration -big_permissions_update- !!!')
    const dogs_migration_result = await db.collection(COLLECTIONS.DOGS).updateMany(
      {},
      {
        $set: {
          federationId: null,
          healthCertificateIds: null,
          permissions: permissions,
        },
        $unset: {
          type: ''
        }
      }
    );
    console.log('dogs_migration_result => ', dogs_migration_result)
    const litters_migration_result = await db.collection(COLLECTIONS.LITTERS).updateMany(
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
          }
        }
      }
    );
    console.log('litters_migration_result => ', litters_migration_result)
    const profiles_migration_result = await db.collection(COLLECTIONS.PROFILES).updateMany(
      {},
      {
        $rename: { 'dogIds': 'ownDogIds' },
        $set: {
          otherDogIds: [],
          otherLitterIds: []
        }
      }
    );
    console.log('profiles_migration_result => ', profiles_migration_result)
  },

  async down(db, client) {
    await db.collection(COLLECTIONS.DOGS).updateMany(
      {},
      {
        $set: {
          type: DOG_TYPES.MALE_DOG
        },
        $unset: {
          federationId: null,
          healthCertificateIds: null,
          permissions: permissions,
        }
      }
    );
    await db.collection(COLLECTIONS.LITTERS).updateMany(
      {},
      {
        $rename: { 'creatorProfileId': 'profileId' },
        $unset: {
          federationId: '',
          puppiesCount: '',
          verified: ''
        }
      }
    );
    await db.collection(COLLECTIONS.PROFILES).updateMany(
      {},
      {
        $rename: { 'ownDogIds': 'dogIds' },
        $unset: {
          otherDogIds: '',
          otherLitterIds: ''
        }
      }
    );
  }
};
