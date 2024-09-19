import {
  UserData,
  ProfileData,
  IncomingEventData,
  Breed,
  IncomingDogData,
  IncomingLitterData
} from "../../types";
import {signIn, signOut, signUp, getUser, recoveryPassword, saveNewPassword} from './user';
import {createProfile, getProfile} from "./profile";
import {createDog, getStuds, getPuppies, updateBaseDogInfo, deleteDog, validateNewDog, getOtherDogs, getDog} from "./dogs";
import {createLitter, getLittersByDate, updateBaseLitterInfo, deleteLitter} from "./litters";
import {createEvent, updateHeatInfo, updateTreatmentInfo, deleteEventsByIds} from './events'
import {getPedigreeByDogId} from "./pedigrees";
import {getBreeds, createBreed} from './breeds';

// ToDo URL вынести в переменные окружения
export const URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'

const clientErrStatuses = [400, 401, 403, 429]

export const checkResponse = async (r: Response) => {
  if (clientErrStatuses.includes(r.status)) {
    const {message}: {message: string} = await r.json()
    throw new Error(message)
  }
}

async function getInitialDataReq(): Promise<{
  userData: UserData,
  profileData: ProfileData,
  dogs: IncomingDogData[],
  litters: IncomingLitterData[],
  events: IncomingEventData[],
  breeds: Breed[],
}> {
  try {
    return await fetch(`${URL}/api/initial-data`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(async r => {
      await checkResponse(r)
      return r.json()
    })
  } catch (error) {
    console.error(error)
  }
}

async function refreshAccessToken(): Promise<{accessToken: string | null}> {
  return await fetch(`${URL}/api/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
  }).then(async r => {
    await checkResponse(r)
    return r.json()
  }).catch(() => ({accessToken: null}))
}

export {
  refreshAccessToken,
  signIn,
  signOut,
  getUser,
  signUp,
  recoveryPassword,
  saveNewPassword,
  getInitialDataReq,
  createProfile,
  getProfile,
  createDog,
  deleteDog,
  getDog,
  validateNewDog,
  getOtherDogs,
  getStuds,
  getPuppies,
  createLitter,
  deleteLitter,
  createEvent,
  getLittersByDate,
  updateBaseDogInfo,
  updateBaseLitterInfo,
  updateHeatInfo,
  updateTreatmentInfo,
  deleteEventsByIds,
  getPedigreeByDogId,
  getBreeds,
  createBreed,
}
