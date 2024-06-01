import {UserData, ProfileData, DogData, LitterData, EventData} from "../../types";
import {signIn, signOut, signUp, getUser, recoveryPassword, saveNewPassword} from './user';
import {createProfile, getProfile} from "./profile";
import {createDog, getStuds, getPuppies, updateBaseDogInfo, deleteDog} from "./dogs";
import {createLitter, getLittersByDate, updateBaseLitterInfo, deleteLitter} from "./litters";
import {createEvent, updateHeatInfo, updateTreatmentInfo, deleteEventsByIds} from './events'
import {navigate} from "wouter/use-browser-location";
import {getPedigreeByDogId} from "./pedigrees";
import {Paths} from "../../constants/routes";

// ToDo URL вынести в переменные окружения
export const URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'
async function getInitialDataReq(): Promise<{
  userData: UserData,
  profileData: ProfileData,
  dogs: DogData[],
  litters: LitterData[],
  events: EventData[],
}> {
  try {
    return await fetch(`${URL}/api/initial-data`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then(r => {
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
}
