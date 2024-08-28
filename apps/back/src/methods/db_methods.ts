import {MongoClient, ObjectId, WithId, Filter, Document, UpdateFilter, DeleteResult} from "mongodb";
import {
  User,
  DatabaseProfile,
  History,
  DatabaseLitter,
  ContactList,
  Contact,
  DatabaseDogEvent,
  DatabaseDog,
  GENDER,
  Breed,
  BreedIssue,
  RawTreatmentFields,
  DatabaseDocument,
} from "../types";
import {COLLECTIONS, FIELDS_NAMES, DB_NAME} from "../constants";

type DatabaseTypes = DatabaseDog | User | DatabaseProfile | DatabaseLitter | History | Contact | ContactList | DatabaseDogEvent | Breed | BreedIssue | DatabaseDocument

export const insertEntity = async(
  client: MongoClient,
  collectionName: COLLECTIONS,
  insertedEntity: DatabaseTypes
) => {
  return await client.db(DB_NAME).collection(collectionName).insertOne(insertedEntity)
}

export const modifyNestedArrayField = async <T extends Document> (
  client: MongoClient,
  collectionName: COLLECTIONS,
  identifierId: ObjectId,
  identifierFieldName: FIELDS_NAMES,
  modifiedFieldName: FIELDS_NAMES,
  pushedId: ObjectId | null,
  modifyType: '$push' | '$set' | '$pull' | '$addToSet' = '$push'
) => {
  return await client.db(DB_NAME).collection<T>(collectionName).updateOne(
    { [identifierFieldName]: identifierId } as Filter<T>,
    {
      [modifyType]: {
        [modifiedFieldName]: pushedId
      }
    } as UpdateFilter<T>
  )
}

export const modifyNestedArrayFieldById = async <T extends Document>(
  client: MongoClient,
  collectionName: COLLECTIONS,
  identifierId: ObjectId,
  pushedId: ObjectId,
  modifiedFieldName: FIELDS_NAMES,
  modifyType: '$push' | '$set' | '$pull' | '$addToSet' = '$push'
) => {
  return await client.db(DB_NAME).collection<T>(collectionName).updateOne(
    { _id: identifierId } as Filter<T>,
    {
      [modifyType]: {
        [modifiedFieldName]: pushedId,
      }
    } as UpdateFilter<T>
  )
}

export const assignIdToField = async <T extends Document> (
  client: MongoClient,
  collectionName: COLLECTIONS,
  identifierId: ObjectId,
  assignedFieldName: FIELDS_NAMES,
  newId: ObjectId,
) => {
  await client.db(DB_NAME).collection<T>(collectionName).updateOne(
    { _id: new ObjectId(identifierId) } as Filter<T>,
    {
      $set: {
        [assignedFieldName]: new ObjectId(newId)
      }
    } as UpdateFilter<T>
  )
}

export const assignValueToField = async <T extends Document> (
  client: MongoClient,
  collectionName: COLLECTIONS,
  identifierId: ObjectId,
  assignedFieldName: FIELDS_NAMES,
  newValue: string | null,
) => {
  await client.db(DB_NAME).collection<T>(collectionName).updateOne(
    { _id: new ObjectId(identifierId) } as Filter<T>,
    {
      $set: {
        [assignedFieldName]: newValue
      }
    } as UpdateFilter<T>
  )
}

export const findOneField = async <T extends Document> (
  client: MongoClient,
  collectionName: COLLECTIONS,
  searchedEntityId: string | ObjectId,
  searchedFieldName: FIELDS_NAMES,
) => {
  return await client.db(DB_NAME).collection<T>(collectionName)
    .findOne(
      { _id: new ObjectId(searchedEntityId) } as Filter<T>,
      { projection: { [searchedFieldName]: true } }
    )
}

export const findDogLitterHistory = async (
  client: MongoClient,
  collectionName: COLLECTIONS,
  searchedEntityId: string | ObjectId,
) => {
  return await client.db(DB_NAME).collection<DatabaseDog>(collectionName)
    .findOne(
      { _id: new ObjectId(searchedEntityId) } as Filter<DatabaseDog>,
      { projection: { [FIELDS_NAMES.REPRODUCTIVE_HISTORY]: { [FIELDS_NAMES.LITTER_IDS]: true } } }
    )
}

export const findUserByEmail = async (
  client: MongoClient,
  email: string,
) => {
  return await client
    .db(DB_NAME)
    .collection<User>(COLLECTIONS.USERS)
    .findOne({ email })
}

export const findUserById = async (
  client: MongoClient,
  id: string,
): Promise<WithId<User> | null> => {
  return await client
    .db(DB_NAME)
    .collection<User>(COLLECTIONS.USERS)
    .findOne({ _id: new ObjectId(id) })
}

export const findEntityById = async <T extends Document>(
  client: MongoClient,
  collectionName: COLLECTIONS,
  id: ObjectId
): Promise<WithId<T> | null> => {
  return await client
    .db(DB_NAME)
    .collection<T>(collectionName)
    .findOne({ _id: id } as Filter<T>)
}

export const findEntitiesByIds = async <T extends Document>( // todo unnecessary function, see next
  client: MongoClient,
  collectionName: COLLECTIONS,
  ids: ObjectId[],
): Promise<WithId<T>[]> => {
  return await client
    .db(DB_NAME)
    .collection<T>(collectionName)
    .find({
      _id: { $in: ids }
    } as Filter<T>)
    .toArray()
}

export const findEntitiesByObjectIds = async<T extends Document>(
  client: MongoClient,
  collectionName: COLLECTIONS,
  objectIds: ObjectId[],
  fieldName: FIELDS_NAMES = FIELDS_NAMES.ID,
): Promise<WithId<T>[]> => {
  return await client
    .db(DB_NAME)
    .collection<T>(collectionName)
    .find({ [fieldName]: { $in: objectIds } } as Filter<T>).toArray() as WithId<T>[];
}

export const activateProfileByActivator = async (
  client: MongoClient,
  id: string,
  activator: string,
) => {
  await client.db(DB_NAME).collection<User>(COLLECTIONS.USERS).updateOne(
    {
      _id: new ObjectId(id),
      activator
    },
    {
      $set: {
        [FIELDS_NAMES.IS_ACTIVATED]: true,
      }
    }
  )
}

export const findStudsBySearchString = async(
  client: MongoClient,
  fieldName: FIELDS_NAMES,
  gender: GENDER,
  searchString: string,
) => {
  return await client.db(DB_NAME).collection<DatabaseDog>(COLLECTIONS.DOGS).find({
    [fieldName]: { $regex: searchString, $options: 'i' },
    gender,
  }, {
    projection: {
      _id: 1,
      fullName: 1,
      breedId: 1,
    }
  }).toArray();
}

export const findEntitiesBySearchString = async<T extends Document>(
  client: MongoClient,
  collectionName: COLLECTIONS,
  fieldName: FIELDS_NAMES,
  searchString: string,
) => {
  return await client.db(DB_NAME).collection<T>(collectionName).find({
    [fieldName]: { $regex: searchString, $options: 'i' },
  } as Filter<T>).toArray();
}

export const findPuppiesByDateOfBirth = async(
  client: MongoClient,
  dateOfBirth: string,
  breedId: ObjectId | null,
) => {
  return await client.db(DB_NAME).collection<DatabaseDog>(COLLECTIONS.DOGS).find({
    dateOfBirth,
    breedId,
    litterId: null,
  }, {
    projection: {
      _id: 1,
      fullName: 1,
      breedId: 1,
    }
  }).toArray();
}

export const findLittersByDate = async(
  client: MongoClient,
  dateOfBirth: string,
  breedId: ObjectId | null,
): Promise<Pick<WithId<DatabaseLitter>, '_id' | 'litterTitle' | 'dateOfBirth'>[]> => {
  return await client.db(DB_NAME).collection<DatabaseLitter>(COLLECTIONS.LITTERS).find({
    dateOfBirth,
    breedId,
  }, {
    projection: {
      _id: 1,
      litterTitle: 1,
      dateOfBirth: 1,
    }
  }).toArray()
}

export const updateBaseDogInfoById = async(
  client: MongoClient,
  id: ObjectId,
  baseInfo: Pick<DatabaseDog,
    | 'gender'
    | 'dateOfBirth'
    | 'color'
    | 'name'
    | 'fullName'
    | 'microchipNumber'
    | 'pedigreeNumber'
    | 'tattooNumber'
    | 'isNeutered'
    | 'litterId'
    | 'breedId'
    | 'ownerProfileId'
  >
)=> {
  await client.db(DB_NAME).collection<DatabaseDog>(COLLECTIONS.DOGS).updateOne(
    { _id: id } as Filter<DatabaseDog>,
    {
      $set: baseInfo
    } as UpdateFilter<DatabaseDog>
  )
}

export const updateBaseLitterInfoById = async(
  client: MongoClient,
  id: ObjectId,
  baseInfo: Pick<DatabaseLitter, 'comments'>
) => {
  await client.db(DB_NAME).collection<DatabaseLitter>(COLLECTIONS.LITTERS).updateOne(
    { _id: id } as Filter<DatabaseLitter>,
    {
      $set: baseInfo
    } as UpdateFilter<DatabaseLitter>
  )
}

export const updateBaseHeatInfoById = async(
  client: MongoClient,
  id: ObjectId,
  newHeatInfo: Pick<DatabaseDogEvent, 'comments' | 'date' | 'activated'>
)=> {
  await client.db(DB_NAME).collection<DatabaseDogEvent>(COLLECTIONS.EVENTS).updateOne(
    { _id: id } as Filter<DatabaseDogEvent>,
    {
      $set: newHeatInfo
    } as UpdateFilter<DatabaseDogEvent>
  )
}

export const updateBaseTreatmentInfoById = async(
  client: MongoClient,
  id: ObjectId,
  newTreatmentInfo: Pick<DatabaseDogEvent, RawTreatmentFields>
)=> {
  await client.db(DB_NAME).collection<DatabaseDogEvent>(COLLECTIONS.EVENTS).updateOne(
    { _id: id } as Filter<DatabaseDogEvent>,
    {
      $set: newTreatmentInfo
    } as UpdateFilter<DatabaseDogEvent>
  )
}

export const deleteEntityById = async<T extends Document>(
  client: MongoClient,
  id: ObjectId,
  collectionName: COLLECTIONS,
)=> {
  return await client.db(DB_NAME).collection<T>(collectionName).deleteOne({
    _id: id
  } as Filter<T>)
}

export const getAllDocuments = async<T extends Document>(
  client: MongoClient,
  collectionName: COLLECTIONS,
) => await client.db(DB_NAME).collection<T>(collectionName).find().toArray()


export const searchDogByParams = async(
  client: MongoClient,
  dogParams: Pick<DatabaseDog, 'breedId' | 'gender' | 'dateOfBirth'>
): Promise<WithId<Pick<DatabaseDog, 'fullName' | 'ownerProfileId' | 'creatorProfileId' | 'federationId' | 'name' | 'dateOfDeath' | 'color' | 'isNeutered' | 'litterId'>>[] | null> =>
  await client.db(DB_NAME).collection<DatabaseDog>(COLLECTIONS.DOGS)
    .find(
      dogParams,
      {
        projection: {
          _id: 1,
          fullName: 1,
          ownerProfileId: 1,
          creatorProfileId: 1,
          federationId: 1,
          name: 1,
          dateOfDeath: 1,
          color: 1,
          isNeutered: 1,
          litterId: 1,
        }
      }
    ).toArray()
