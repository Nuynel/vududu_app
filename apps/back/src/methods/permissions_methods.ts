import {MongoClient, ObjectId, WithId} from "mongodb";
import {
  DATA_GROUPS,
  DatabaseDog,
  DatabaseLitter,
  DatabaseProfile,
  DogDataGroupsByFieldName,
  LitterDataGroupsByFieldName,
  PERMISSION_GROUPS,
  Permissions,
  ProfilePermissionsByEntity,
  ProtectedClientDogData,
  ProtectedClientLitterData
} from "../types";
import {constructDogForClient, constructLitterForClient} from "./data_methods";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {findEntityById} from "./db_methods";
import {CustomError, ERROR_NAME} from "./error_messages_methods";

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

const getEmptyClientLitterData = (id: ObjectId): ProtectedClientLitterData => ({
  _id: id,

  federationId: null,
  fatherData: null,
  motherData: null,
  litterTitle: null,
  dateOfBirth: null,
  breedId: null,
  puppyIds: null,
  verifiedPuppyIds: null,
  verified: null,
  litterSummary: null,
  puppiesData: null,

  comments: null,
  creatorProfileId: null,
  creatorProfileName: null,

  permissions: null
})

// todo получать шаблон пермишенов из профиля, если шаблона нет, то возвращать дефолт
export const getPermissionsSample = (creatorProfileId: ObjectId | null = null): Permissions => ({
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
})

const checkDogDataPermissions = (
  profile: WithId<DatabaseProfile> | null,
  {group, profileIds}: { group: PERMISSION_GROUPS | null, profileIds: ObjectId[] | null },
  dog: DatabaseDog
): boolean => (profile && dog.ownerProfileId?.equals(profile._id))
  || (group === PERMISSION_GROUPS.ALL)
  || !!(group === PERMISSION_GROUPS.REGISTERED && profile)
  || !!(group === PERMISSION_GROUPS.ORGANISATION && profile && profile.connectedOrganisations.canineFederation === dog.federationId)
  || !!(profile && profileIds?.some(id => id.equals(profile._id)))

const getProfilePermissionsByDog = (profile: WithId<DatabaseProfile>, dog: WithId<DatabaseDog>): ProfilePermissionsByEntity => ({
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
  const profilePermissionsByEntity = getProfilePermissionsByDog(profile, dog)

  const preparedDogForClient = await constructDogForClient(client, dog)

  const ownerProfile = dog.ownerProfileId ? await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, dog.ownerProfileId) : null
  const creatorProfile = dog.creatorProfileId ? await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, dog.creatorProfileId): null

  return Object.entries(preparedDogForClient).reduce(
    (acc: ProtectedClientDogData, [key, value]): ProtectedClientDogData => {
      const isCreator = dog.creatorProfileId.equals(profile._id)
      switch (key) {
        case FIELDS_NAMES.FULL_NAME:
        case FIELDS_NAMES.DATE_OF_BIRTH:
        case FIELDS_NAMES.BREED_ID:
        case FIELDS_NAMES.GENDER: {
          return (profilePermissionsByEntity.view[DogDataGroupsByFieldName[key as keyof typeof DogDataGroupsByFieldName]]
            || isCreator)
            ? { ...acc, [key]: value }
            : { ...acc }
        }
        case FIELDS_NAMES.CREATOR_PROFILE_ID: {
          if (!value) return { ...acc }
          return (profilePermissionsByEntity.view[DogDataGroupsByFieldName[key as keyof typeof DogDataGroupsByFieldName]]
            || isCreator)
            ? { ...acc, [key]: value as ObjectId | null, [FIELDS_NAMES.CREATOR_PROFILE_NAME]: creatorProfile ? creatorProfile.name : null}
            : { ...acc, [FIELDS_NAMES.CREATOR_PROFILE_NAME]: null }
        }
        case FIELDS_NAMES.OWNER_PROFILE_ID: {
          if (!value) return { ...acc }
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

const checkLitterDataPermissions = (
  profile: WithId<DatabaseProfile> | null,
  {group, profileIds}: { group: PERMISSION_GROUPS | null, profileIds: ObjectId[] | null },
  litter: DatabaseLitter,
  fatherOwnerId: ObjectId | null,
  motherOwnerId: ObjectId | null,
): boolean => (profile && (profile._id.equals(fatherOwnerId) || profile._id.equals(motherOwnerId)))
  || (group === PERMISSION_GROUPS.ALL)
  || !!(group === PERMISSION_GROUPS.REGISTERED && profile)
  || !!(group === PERMISSION_GROUPS.ORGANISATION && profile && profile.connectedOrganisations.canineFederation === litter.federationId)
  || !!(profile && profileIds?.includes(profile?._id))

const getProfilePermissionsByLitter = (
  profile: WithId<DatabaseProfile>,
  litter: WithId<DatabaseLitter>,
  fatherOwnerId: ObjectId | null,
  motherOwnerId: ObjectId | null
): ProfilePermissionsByEntity => ({
  view: {
    [DATA_GROUPS.PUBLIC]: checkLitterDataPermissions(profile, litter.permissions.viewers[DATA_GROUPS.PUBLIC], litter, fatherOwnerId, motherOwnerId),
    [DATA_GROUPS.PROTECTED]: checkLitterDataPermissions(profile, litter.permissions.viewers[DATA_GROUPS.PROTECTED], litter, fatherOwnerId, motherOwnerId),
    [DATA_GROUPS.PRIVATE]: checkLitterDataPermissions(profile, litter.permissions.viewers[DATA_GROUPS.PRIVATE], litter, fatherOwnerId, motherOwnerId),
  },
  edit: {
    [DATA_GROUPS.PUBLIC]: checkLitterDataPermissions(profile, litter.permissions.editors[DATA_GROUPS.PUBLIC], litter, fatherOwnerId, motherOwnerId),
    [DATA_GROUPS.PROTECTED]: checkLitterDataPermissions(profile, litter.permissions.editors[DATA_GROUPS.PROTECTED], litter, fatherOwnerId, motherOwnerId),
    [DATA_GROUPS.PRIVATE]: checkLitterDataPermissions(profile, litter.permissions.editors[DATA_GROUPS.PRIVATE], litter, fatherOwnerId, motherOwnerId),
  }
})

export const constructProtectedLitterForClient = async (client: MongoClient, litter: WithId<DatabaseLitter>, profile: WithId<DatabaseProfile>): Promise<ProtectedClientLitterData> => {
  const father = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, litter.fatherId)
  const mother = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, litter.motherId)

  if (!father || !mother) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'permissions_methods', line: 198})

  const profilePermissionsByEntity = getProfilePermissionsByLitter(profile, litter, father.ownerProfileId, mother.ownerProfileId)

  const preparedLitterForClient = await constructLitterForClient(client, litter)

  const creatorProfile = litter.creatorProfileId ? await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, litter.creatorProfileId): null

  return Object.entries(preparedLitterForClient).reduce(
    (acc: ProtectedClientLitterData, [key, value]): ProtectedClientLitterData => {
      const isCreator = litter.creatorProfileId.equals(profile._id)
      switch (key) {
        case FIELDS_NAMES.FATHER_DATA:
        case FIELDS_NAMES.MOTHER_DATA:
        case FIELDS_NAMES.BREED_ID:
        case FIELDS_NAMES.DATE_OF_BIRTH:
        case FIELDS_NAMES.PUPPY_IDS:
        case FIELDS_NAMES.PUPPIES_DATA:
        case FIELDS_NAMES.LITTER_TITLE: {
          return (profilePermissionsByEntity.view[LitterDataGroupsByFieldName[key as keyof typeof LitterDataGroupsByFieldName]]
            || isCreator)
            ? { ...acc, [key]: value }
            : { ...acc }
        }
        case FIELDS_NAMES.CREATOR_PROFILE_ID: {
          if (!value) return { ...acc }
          return (profilePermissionsByEntity.view[LitterDataGroupsByFieldName[key as keyof typeof LitterDataGroupsByFieldName]]
            || isCreator)
            ? { ...acc, [key]: value as ObjectId | null, [FIELDS_NAMES.CREATOR_PROFILE_NAME]: creatorProfile ? creatorProfile.name : null}
            : { ...acc, [FIELDS_NAMES.CREATOR_PROFILE_NAME]: null }
        }
        default: {
          return profilePermissionsByEntity
            .view[LitterDataGroupsByFieldName[key as keyof typeof LitterDataGroupsByFieldName]]
            ? { ...acc, [key]: value }
            : { ...acc }
        }
      }
    }, {...getEmptyClientLitterData(litter._id)})
}
