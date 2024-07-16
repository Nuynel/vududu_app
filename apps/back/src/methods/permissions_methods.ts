import {MongoClient, ObjectId, WithId} from "mongodb";
import {
  DATA_GROUPS,
  DatabaseDog,
  DatabaseProfile, DogDataGroupsByFieldName, GENDER,
  PERMISSION_GROUPS,
  ProfilePermissionsByDog, ProtectedClientDogData
} from "../types";
import {constructDogForClient} from "./data_methods";

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

const checkDogDataPermissions = (
  profile: WithId<DatabaseProfile> | null,
  {group, profileIds}: { group: PERMISSION_GROUPS | null, profileIds: ObjectId[] | null },
  dog: DatabaseDog
): boolean => (profile && dog.ownerProfileId === profile._id)
  || (group === PERMISSION_GROUPS.ALL)
  || !!(group === PERMISSION_GROUPS.REGISTERED && profile)
  || !!(group === PERMISSION_GROUPS.ORGANISATION && profile && profile.connectedOrganisations.canineFederation === dog.federationId)
  || !!(profile && profileIds?.includes(profile?._id))

const getProfilePermissionsByDog = (profile: WithId<DatabaseProfile>, dog: WithId<DatabaseDog>): ProfilePermissionsByDog => ({
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
  const profilePermissionsByDog = getProfilePermissionsByDog(profile, dog)

  const preparedDogForClient = await constructDogForClient(client, dog)

  return Object.entries(preparedDogForClient).reduce(
    (acc: ProtectedClientDogData, [key, value]): ProtectedClientDogData => {
      return profilePermissionsByDog
        .view[DogDataGroupsByFieldName[key as keyof typeof DogDataGroupsByFieldName]]
        ? { ...acc, [key]: value }
        : { ...acc }
    }, {...getEmptyClientDogData(dog._id)})
}
