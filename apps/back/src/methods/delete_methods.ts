import {DatabaseDog, DatabaseEvent, DatabaseProfile, EVENT_TYPE} from "../types";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {MongoClient, ObjectId} from "mongodb";
import {deleteEntityById, findEntityById, modifyNestedArrayField} from "./db_methods";
import {CustomError, ERROR_NAME} from "./error_messages_methods";

export const getFieldNameByEventType = (eventType: EVENT_TYPE) => {
  switch (eventType) {
    case EVENT_TYPE.ANTIPARASITIC_TREATMENT:
    case EVENT_TYPE.VACCINATION: {
      return FIELDS_NAMES.TREATMENT_IDS
    }
    case EVENT_TYPE.HEAT: {
      return FIELDS_NAMES.REPRODUCTIVE_HISTORY_HEAT_IDS
    }
  }
  return FIELDS_NAMES.ID
}

export const deleteEventFromDog = async (eventId: ObjectId, dogId: ObjectId, fieldName: FIELDS_NAMES, client: MongoClient) => {
  const deleteFromDogResult = await modifyNestedArrayField<DatabaseDog>(
    client,
    COLLECTIONS.DOGS,
    dogId,
    FIELDS_NAMES.ID,
    fieldName,
    new ObjectId(eventId),
    '$pull'
  )
  if (!deleteFromDogResult.modifiedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'delete_methods', line: 30})
}

export const deleteEventFromProfile = async (eventId: ObjectId, profileId: ObjectId, client: MongoClient) => {
  const deleteFromProfileResult = await modifyNestedArrayField<DatabaseProfile>(
    client,
    COLLECTIONS.PROFILES,
    profileId,
    FIELDS_NAMES.ID,
    FIELDS_NAMES.EVENT_IDS,
    new ObjectId(eventId),
    '$pull'
  )
  if (!deleteFromProfileResult.modifiedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'delete_methods', line: 43})
}

export const deleteEventFromLinkedEntities = async (eventId: ObjectId, dogId: ObjectId, profileId: ObjectId, fieldName: FIELDS_NAMES, client: MongoClient) => {
  await deleteEventFromDog(eventId, dogId, fieldName, client)
  await deleteEventFromProfile(eventId, profileId, client)
}

export const deleteEvent = async (eventId: ObjectId, client: MongoClient) => {
  const event = await findEntityById<DatabaseEvent>(client, COLLECTIONS.EVENTS, eventId)
  if (!event) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'delete_methods', line: 53})
  const {profileId, dogId} = event
  await deleteEventFromLinkedEntities(eventId, dogId, profileId, getFieldNameByEventType(event.eventType), client)
  const eventDeleteResult = await deleteEntityById<DatabaseEvent>(client, eventId, COLLECTIONS.EVENTS)
  if (!eventDeleteResult.deletedCount) return new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'delete_methods', line: 57})
}
