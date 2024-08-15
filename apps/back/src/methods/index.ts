import {MongoClient, ObjectId, WithId} from "mongodb";
import {DatabaseProfile, PROFILE_TYPES} from "../types";
import {COLLECTIONS} from "../constants";
import {
  generateAccessToken,
  generateAPIAccessToken,
  generateRefreshToken,
  generateRecoveryToken,
  checkAPIAccessToken,
  checkRefreshToken,
  checkRecoveryToken
} from "./jwt_methods";
import {
  isPasswordCorrect,
  checkIn,
  hashPass
} from "./login_methods";
import {CustomError, ERROR_NAME, errorHandler} from "./error_messages_methods";
import {
  insertEntity,
  findOneField,
  modifyNestedArrayField,
  modifyNestedArrayFieldById,
  assignIdToField,
  assignValueToField,
  findUserByEmail,
  findUserById,
  activateProfileByActivator,
  findEntityById,
  findEntitiesByObjectIds,
  findDogLitterHistory,
  findEntitiesByIds,
  findStudsBySearchString,
  findEntitiesBySearchString,
  findPuppiesByDateOfBirth,
  findLittersByDate,
  updateBaseDogInfoById,
  updateBaseLitterInfoById,
  updateBaseHeatInfoById,
  updateBaseTreatmentInfoById,
  deleteEntityById,
  getAllDocuments,
  searchDogByParams,
} from "./db_methods";
import {deleteEventFromDog, deleteEventFromProfile, deleteEvent, getFieldNameByEventType} from './delete_methods'

import {constructDogForClient, constructLitterForClient} from "./data_methods";
import {getCookiesPayload} from "./validation_methods";
import {constructProtectedDogForClient, getPermissionsSample} from "./permissions_methods";
import dayjs from "dayjs";

export const verifyProfileType = async (client: MongoClient, profileId: string) => {
  const profile: WithId<DatabaseProfile> | null = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId))
  if (!profile || !(profile.type === PROFILE_TYPES.BREEDER || profile.type === PROFILE_TYPES.KENNEL)) {
    throw new CustomError(ERROR_NAME.INVALID_PAYLOAD, {file: 'src/methods/index', line: 37})
  }
  return profile
}

function shiftDatesWithTimezone(dateStrings: string[], days: number): string[] {
  return dateStrings.map(dateString => {
    // Создание объекта dayjs с учётом временной зоны из исходной строки
    const date = dayjs.tz(dateString);
    // Добавление дней
    const shiftedDate = date.add(days, 'day');
    // Возвращение изменённой даты в исходном формате
    return shiftedDate.format();
  });
}

const getTimestamp = () => new Date().toISOString();

export {
  generateAccessToken,
  generateAPIAccessToken,
  generateRefreshToken,
  generateRecoveryToken,
  checkAPIAccessToken,
  checkRefreshToken,
  checkRecoveryToken,
  isPasswordCorrect,
  checkIn,
  insertEntity,
  findOneField,
  modifyNestedArrayFieldById,
  modifyNestedArrayField,
  assignIdToField,
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
  findEntitiesBySearchString,
  findPuppiesByDateOfBirth,
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
  getTimestamp,
  hashPass,
  getAllDocuments,
  shiftDatesWithTimezone,
  searchDogByParams,
  constructProtectedDogForClient,
  getPermissionsSample,
}
