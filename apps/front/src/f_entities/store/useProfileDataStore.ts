import {create} from "zustand";
import {
  DogData,
  LitterData,
  ProfileData, ConnectedOrganisations, KennelConnectedOrganizations, BreederConnectedOrganizations,
  ProfileStorage, UserData, EventData,
} from "../../g_shared/types";

type ProfileDataStore = {
  email: string,
  profileIds: string[],
  setUserData: (userData: UserData) => void,

  accessToken: string | null,
  setAccessToken: (accessToken: string | null) => void,
  saveAccessToken: (accessToken: string | null) => void,
  removeAccessToken: () => void,
  loadAccessToken: () => void,

  name: string;
  type: string;
  documentIds: string[];
  contactIds: string[];
  eventIds: string[];
  dogIds: string[];
  litterIds: string[];
  connectedOrganisations: Pick<ConnectedOrganisations, BreederConnectedOrganizations>
  setProfileData: (profileData: ProfileData) => void,

  dogsData: DogData[],
  setDogsData: (dogsData: DogData[]) => void,
  pushNewDog: (dogData: DogData) => void,
  getDogsByIds: () => Record<string, DogData>
  getDogById: (id: string) => DogData,

  littersData: LitterData[]
  setLittersData: (littersData: LitterData[]) => void,
  pushNewLitter: (litterData: LitterData) => void,
  getLittersByIds: () => Record<string, LitterData>
  getLitterById: (id: string) => LitterData,

  eventsData: EventData[],
  setEventsData: (eventsData: EventData[]) => void,
  pushNewEvent: (eventData: EventData) => void,
  getEventsByIds: () => Record<string, EventData>,
  getEventById: (id: string) => EventData,
}

export const useProfileDataStore = create<ProfileDataStore>((set, get) => ({
  email: '',
  profileIds: [],
  setUserData: (userData) => set((state: ProfileDataStore): ProfileDataStore => ({...state, ...userData})),

  accessToken: '',
  setAccessToken: (accessToken) => set((state: ProfileDataStore): ProfileDataStore => ({...state, accessToken})),
  saveAccessToken: (accessToken) => localStorage.setItem('accessToken', accessToken),
  removeAccessToken: () => localStorage.removeItem('accessToken'),
  loadAccessToken: () => set((state: ProfileDataStore): ProfileDataStore => ({...state, accessToken: localStorage.getItem('accessToken')})),

  name: '',
  type: '',
  documentIds: [],
  contactIds: [],
  eventIds: [],
  dogIds: [],
  litterIds: [],
  connectedOrganisations: {
    canineFederation: null,
    nationalBreedClub: null,
    canineClub: null,
    kennel: null,
  },
  setProfileData: (profileData) => set((state): ProfileStorage => ({...state, ...profileData})),

  dogsData: [],
  setDogsData: (newDogsData) => set((state: ProfileDataStore): ProfileDataStore => ({...state, dogsData: newDogsData})),
  pushNewDog: (newDogData) => set((state: ProfileDataStore): ProfileDataStore => ({...state, dogsData: [...state.dogsData, newDogData]})),
  getDogsByIds: () => get().dogsData.reduce((acc, dogData) => {
    return {
      ...acc,
      [dogData._id]: dogData
    }
  }, {}),
  getDogById: (id) => get().getDogsByIds()[id],

  littersData: [],
  setLittersData: (newLittersData) => set((state: ProfileDataStore): ProfileDataStore => ({...state, littersData: newLittersData})),
  pushNewLitter: (newLitterData) => set((state: ProfileDataStore): ProfileDataStore => ({...state, littersData: [...state.littersData, newLitterData]})),
  getLittersByIds: () => get().littersData.reduce((acc, litterData) => {
    return {
      ...acc,
      [litterData._id]: litterData
    }
  }, {}),
  getLitterById: (id) => get().getLittersByIds()[id],

  eventsData: [],
  setEventsData: (newEventsData) => set((state: ProfileDataStore): ProfileDataStore => ({...state, eventsData: newEventsData})),
  pushNewEvent: (newEventData) => set((state: ProfileDataStore): ProfileDataStore => ({...state, eventsData: [...state.eventsData, newEventData]})),
  getEventsByIds: () => get().eventsData.reduce((acc, eventData) => {
    return {
      ...acc,
      [eventData._id]: eventData
    }
  }, {}),
  getEventById: (id) => get().getEventsByIds()[id],

}))
