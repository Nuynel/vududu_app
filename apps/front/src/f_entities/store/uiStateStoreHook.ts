import { create } from 'zustand';
import {DATA_TYPES} from "../../g_shared/types/event";
import {EVENT_TYPE} from "../../g_shared/types/event";

type UIStorage = {
  // isRegistered: boolean,
  // isLoading: boolean,
  // isEmailConfirmed: boolean,
  // switchIsRegistered: () => void,
  // switchIsLoading: () => void,

  eventTypeFilter: EVENT_TYPE | null,
  setEventTypeFilter: (newEventType: EVENT_TYPE | null) => void,

  dogTypeFilter: 'ownDogs' | 'allAddedDogs',
  setDogTypeFilter: (newDogType: 'ownDogs' | 'allAddedDogs') => void,

  litterTypeFilter: 'ownLitters' | 'allAddedLitters',
  setLitterTypeFilter: (newLitterType: 'ownLitters' | 'allAddedLitters') => void,

  activeDataType: DATA_TYPES,
  setActiveDataType: (newDataType: DATA_TYPES) => void,

  probandId: string | null,
  setProbandId: (newProbandId: string | null) => void,

  activePedigreeDogId: string | null,
  setActivePedigreeDogId: (newActivePedigreeDogId: string | null) => void,
}

export const useUIStateStore = create<UIStorage>(set => ({
  // isRegistered: true,
  // isLoading: true,
  // isEmailConfirmed: true,
  // switchIsLoading: () => set(state => ({isLoading: !state.isLoading})),
  // switchIsRegistered: () => set(state => ({isRegistered: !state.isRegistered})),

  eventTypeFilter: null,
  setEventTypeFilter: (newEventType) => set(state => ({...state, eventTypeFilter: newEventType })),

  activeDataType: DATA_TYPES.PLANNED,
  setActiveDataType: (newDataType) => set(state => ({...state, activeDataType: newDataType })),

  probandId: null,
  setProbandId: (newProbandId) => set(state => ({...state, probandId: newProbandId})),

  activePedigreeDogId: null,
  setActivePedigreeDogId: (newActivePedigreeDogId) => set(state => ({...state, activePedigreeDogId: newActivePedigreeDogId})),

  dogTypeFilter: "ownDogs",
  setDogTypeFilter: (newDogType) => set(state => ({...state, dogTypeFilter: newDogType })),

  litterTypeFilter: "ownLitters",
  setLitterTypeFilter: (newLitterType) => set(state => ({...state, litterTypeFilter: newLitterType })),
}))
