import {create} from "zustand";
import {
  IncomingDogData,
  IncomingLitterData,
  ProfileData,
  ConnectedOrganisations,
  BreederConnectedOrganizations,
  ProfileStorage,
  UserData,
  IncomingEventData,
  Breed,
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

  dogsData: IncomingDogData[],
  setDogsData: (dogsData: IncomingDogData[]) => void,
  pushNewDog: (dogData: IncomingDogData) => void,
  getDogsByIds: () => Record<string, IncomingDogData>
  getDogById: (id: string) => IncomingDogData,

  littersData: IncomingLitterData[]
  setLittersData: (littersData: IncomingLitterData[]) => void,
  pushNewLitter: (litterData: IncomingLitterData) => void,
  getLittersByIds: () => Record<string, IncomingLitterData>
  getLitterById: (id: string) => IncomingLitterData,

  eventsData: IncomingEventData[],
  setEventsData: (eventsData: IncomingEventData[]) => void,
  pushNewEvent: (eventData: IncomingEventData) => void,
  getEventsByIds: () => Record<string, IncomingEventData>,
  getEventById: (id: string) => IncomingEventData,

  breedsData: Breed[],
  setBreedsData: (breedsData: Breed[]) => void,
  pushNewBreed: (breedData: Breed) => void,
  getBreedsByIds: () => Record<string, Breed>,
  getBreedById: (id: string | null) => Breed,
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

  breedsData: [],
  setBreedsData: (newBreedsData) => set((state: ProfileDataStore): ProfileDataStore => ({...state, breedsData: newBreedsData})),
  pushNewBreed: (newBreedData) => set((state: ProfileDataStore): ProfileDataStore => ({...state, breedsData: [...state.breedsData, newBreedData]})),
  getBreedsByIds: () => get().breedsData.reduce((acc, breedData) => {
    return {
      ...acc,
      [breedData._id]: breedData
    }
  }, {}),
  getBreedById: (id) => get().getBreedsByIds()[id],
}))
