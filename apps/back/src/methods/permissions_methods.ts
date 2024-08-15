import {MongoClient, ObjectId, WithId} from "mongodb";
import {
  DATA_GROUPS,
  DatabaseDog,
  DatabaseProfile,
  DogDataGroupsByFieldName,
  PERMISSION_GROUPS, Permissions,
  ProfilePermissionsByEntity,
  ProtectedClientDogData
} from "../types";
import {constructDogForClient} from "./data_methods";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {findEntityById} from "./db_methods";

const getEmptyClientDogData = (id: ObjectId): ProtectedClientDogData => ({
  _id: id,

  name: null,
  fullName: '',
  dateOfBirth: '',
  dateOfDeath: null,
  breedId: null,
  gender: null,
  microchipNumber: null,
  tattooNumber: null,
  pedigreeNumber: null,
  color: null,
  isNeutered: null,

  creatorProfileId: null,
  ownerProfileId: null,
  creatorProfileName: null,
  ownerProfileName: null,
  breederProfileId: null,
  federationId: null,

  litterData: null,
  reproductiveHistory: {
    litters: null
  },
  treatments: null,
  diagnostics: null,
  vaccinations: null,
  healthCertificates: null,

  puppyCardId: null,
  puppyCardNumber: null,
  pedigreeId: null,

  permissions: null
})

export const getPermissionsSample = (creatorProfileId: ObjectId | null = null) => {
  // todo получать шаблон пермишенов из профиля, если шаблона нет, то возвращать дефолт

  const permissions: Permissions = {
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
        profileIds: creatorProfileId ? [creatorProfileId] : []
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

  return permissions
}

const checkDogDataPermissions = (
  profile: WithId<DatabaseProfile> | null,
  {group, profileIds}: { group: PERMISSION_GROUPS | null, profileIds: ObjectId[] | null },
  dog: DatabaseDog
): boolean => (profile && dog.ownerProfileId?.equals(profile._id))
  || (group === PERMISSION_GROUPS.ALL)
  || !!(group === PERMISSION_GROUPS.REGISTERED && profile)
  || !!(group === PERMISSION_GROUPS.ORGANISATION && profile && profile.connectedOrganisations.canineFederation === dog.federationId)
  || !!(profile && profileIds?.includes(profile?._id))

const getProfilePermissionsByEntity = (profile: WithId<DatabaseProfile>, dog: WithId<DatabaseDog>): ProfilePermissionsByEntity => ({
  view: {
    [DATA_GROUPS.PUBLIC]: checkDogDataPermissions(profile, dog.permissions.viewers[DATA_GROUPS.PUBLIC], dog),
    [DATA_GROUPS.PROTECTED]: checkDogDataPermissions(profile, dog.permissions.viewers[DATA_GROUPS.PROTECTED], dog),
    [DATA_GROUPS.PRIVATE]: checkDogDataPermissions(profile, dog.permissions.viewers[DATA_GROUPS.PRIVATE], dog),
  },
  edit: {
    [DATA_GROUPS.PUBLIC]: checkDogDataPermissions(profile, dog.permissions.editors[DATA_GROUPS.PUBLIC], dog),
    [DATA_GROUPS.PROTECTED]: checkDogDataPermissions(profile, dog.permissions.editors[DATA_GROUPS.PROTECTED], dog),
    [DATA_GROUPS.PRIVATE]: checkDogDataPermissions(profile, dog.permissions.editors[DATA_GROUPS.PRIVATE], dog),
  }
})

export const constructProtectedDogForClient = async (client: MongoClient, dog: WithId<DatabaseDog>, profile: WithId<DatabaseProfile>): Promise<ProtectedClientDogData> => {
  const profilePermissionsByEntity = getProfilePermissionsByEntity(profile, dog)

  const preparedDogForClient = await constructDogForClient(client, dog)

  const ownerProfile = dog.ownerProfileId ? await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, dog.ownerProfileId) : null
  const creatorProfile = dog.creatorProfileId ? await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, dog.creatorProfileId): null

  return Object.entries(preparedDogForClient).reduce(
    (acc: ProtectedClientDogData, [key, value]): ProtectedClientDogData => {
      switch (key) {
        case FIELDS_NAMES.FULL_NAME:
        case FIELDS_NAMES.DATE_OF_BIRTH:
        case FIELDS_NAMES.BREED_ID:
        case FIELDS_NAMES.GENDER: {
          const isCreator = dog.creatorProfileId.equals(profile._id)
          return (profilePermissionsByEntity.view[DogDataGroupsByFieldName[key as keyof typeof DogDataGroupsByFieldName]]
            || isCreator)
            ? { ...acc, [key]: value }
            : { ...acc }
        }
        case FIELDS_NAMES.CREATOR_PROFILE_ID: {
          if (!value) return { ...acc }
          const isCreator = dog.creatorProfileId.equals(profile._id)
          return (profilePermissionsByEntity.view[DogDataGroupsByFieldName[key as keyof typeof DogDataGroupsByFieldName]]
            || isCreator)
            ? { ...acc, [key]: value as ObjectId | null, [FIELDS_NAMES.CREATOR_PROFILE_NAME]: creatorProfile ? creatorProfile.name : null}
            : { ...acc, [FIELDS_NAMES.CREATOR_PROFILE_NAME]: null }
        }
        case FIELDS_NAMES.OWNER_PROFILE_ID: {
          if (!value) return { ...acc }
          const isCreator = dog.creatorProfileId.equals(profile._id)
          return (profilePermissionsByEntity.view[DogDataGroupsByFieldName[key as keyof typeof DogDataGroupsByFieldName]]
            || isCreator)
            ? { ...acc, [key]: value as ObjectId | null, [FIELDS_NAMES.OWNER_PROFILE_NAME]: ownerProfile ? ownerProfile.name : null}
            : { ...acc, [FIELDS_NAMES.OWNER_PROFILE_NAME]: null }
        }
        default: {
          return profilePermissionsByEntity
            .view[DogDataGroupsByFieldName[key as keyof typeof DogDataGroupsByFieldName]]
            ? { ...acc, [key]: value }
            : { ...acc }
        }
      }
    }, {...getEmptyClientDogData(dog._id)})
}
