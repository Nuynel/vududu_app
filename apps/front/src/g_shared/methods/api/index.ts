import {UserData, ProfileData, DogData, LitterData, EventData} from "../../types";
import {signIn, signOut, signUp, getUser} from './user';
import {createProfile, getProfile} from "./profile";
import {createDog, getStuds, getPuppies, updateBaseDogInfo, deleteDog} from "./dogs";
import {createLitter, getLittersByDate, updateBaseLitterInfo, deleteLitter} from "./litters";
import {createEvent, updateHeatInfo, updateTreatmentInfo, deleteEventsByIds} from './events'
import {navigate} from "wouter/use-browser-location";
import {getPedigreeByDogId} from "./pedigrees";

// ToDo URL вынести в переменные окружения
export const URL = process.env.REACT_APP_BACKEND_URL
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

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${URL}/api/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data.accessToken;
    }
  } catch (error) {
    console.error('Ошибка при обновлении access токена', error);
    navigate("/sign-in", { replace: true });
    return null;
  }
}

export {
  refreshAccessToken,
  signIn,
  signOut,
  getUser,
  signUp,
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
