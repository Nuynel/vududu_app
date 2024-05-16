import {Request} from "express";
import {MongoClient, ObjectId, WithId} from "mongodb";
import {DatabaseProfile, PROFILE_TYPES} from "../types";
import {COLLECTIONS} from "../constants";
import { generateAccessToken, generateAPIAccessToken, generateRefreshToken, checkAPIAccessToken, checkRefreshToken } from "./jwt_methods";
import { isPasswordCorrect, checkIn } from "./login_methods";
import {CustomError, ERROR_NAME, errorHandler} from "./error_messages_methods";
import {
  insertEntity,
  findOneField,
  modifyNestedArrayField,
  modifyNestedArrayFieldById,
  assignValueToField,
  findUserByEmail,
  findUserById,
  activateProfileByActivator,
  findEntityById,
  findEntitiesByObjectIds,
  findDogLitterHistory,
  findEntitiesByIds,
  findStudsBySearchString,
  findLittersByDate,
  updateBaseDogInfoById,
  updateBaseLitterInfoById,
  updateBaseHeatInfoById,
  updateBaseTreatmentInfoById,
  deleteEntityById,
} from "./db_methods";
import {deleteEventFromDog, deleteEventFromProfile, deleteEvent, getFieldNameByEventType} from './delete_methods'

import {constructDogForClient, constructLitterForClient} from "./data_methods";
import {getCookiesPayload} from "./validation_methods";

export const verifyProfileType = async (client: MongoClient, profileId: string) => {
  const profile: WithId<DatabaseProfile> | null = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId))
  if (!profile || !(profile.type === PROFILE_TYPES.BREEDER || profile.type === PROFILE_TYPES.KENNEL)) throw new CustomError(ERROR_NAME.INVALID_PAYLOAD)
  return profile
}

export {
  generateAccessToken,
  generateAPIAccessToken,
  generateRefreshToken,
  checkAPIAccessToken,
  checkRefreshToken,
  isPasswordCorrect,
  checkIn,
  insertEntity,
  findOneField,
  modifyNestedArrayFieldById,
  modifyNestedArrayField,
  assignValueToField,
  findUserByEmail,
  findUserById,
  findEntityById,
  activateProfileByActivator,
  errorHandler,
  findEntitiesByObjectIds,
  findDogLitterHistory,
  findEntitiesByIds,
  getCookiesPayload,
  findStudsBySearchString,
  findLittersByDate,
  updateBaseDogInfoById,
  updateBaseLitterInfoById,
  constructLitterForClient,
  constructDogForClient,
  updateBaseHeatInfoById,
  updateBaseTreatmentInfoById,
  deleteEntityById,
  deleteEventFromDog,
  deleteEventFromProfile,
  deleteEvent,
  getFieldNameByEventType,
}
