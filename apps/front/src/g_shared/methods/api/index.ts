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
import {createDog, getStuds, getPuppies, updateBaseDogInfo, deleteDog, validateNewDog, getOtherDogs} from "./dogs";
import {createLitter, getLittersByDate, updateBaseLitterInfo, deleteLitter} from "./litters";
import {createEvent, updateHeatInfo, updateTreatmentInfo, deleteEventsByIds} from './events'
import {getPedigreeByDogId} from "./pedigrees";
import {getBreeds, createBreed} from './breeds';

// ToDo URL вынести в переменные окружения
export const URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'

export const checkResponse = (r: Response) => {
  if (r.status === 400 || r.status === 401) {
    throw new Error('Пользователь не добавлен')
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
    }).then(r => {
      checkResponse(r)
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
  }).then(r => {
    checkResponse(r)
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
