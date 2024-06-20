import * as React from 'react'
import {useEffect, useState} from 'react'
import {DATA_TYPES, EVENT_TYPE, IncomingEventData} from "../../g_shared/types/event";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import EntityList, {Entity} from "../../e_features/EntityList";
import {compareDates, sortDates} from "../../g_shared/methods/helpers";
import {useLocation} from "wouter";

type Props = {
  activeType: DATA_TYPES,
  activeEventType: EVENT_TYPE | null,
  selectMode: boolean,
  selectedIds: string[],
  switchIsIdSelected: (id) => void,
}

const EventsList = ({activeType, activeEventType, selectMode, selectedIds, switchIsIdSelected}: Props) => {
  const { eventsData, dogsData } = useProfileDataStore()
  const [, setLocation] = useLocation();

  const [filteredEventsData, changeFilteredEventsData] = useState<Entity[]>([])


  const getDogName = (dogId) => dogsData.find(dogData => dogData._id === dogId).name

  const getEntityList = (list: IncomingEventData[]): Entity[] => {
    return list.map(entity => ({
      _id: entity._id,
      icon: entity.eventType,
      title: getDogName(entity.dogId),
      date: entity.date,
    }))
  }

  useEffect(() => {
    const newFilteredEventsData = eventsData
      .filter(eventData => compareDates(eventData.date, activeType))
      .filter(eventData => activeEventType ? eventData.eventType === activeEventType : true)
    newFilteredEventsData.sort(sortDates)
    if (activeType === DATA_TYPES.PLANNED) {
      const expiredEvents = eventsData
        .filter(eventData => (new Date(eventData.date[0]) < new Date() && eventData.activated === false))
        .filter(eventData => activeEventType ? eventData.eventType === activeEventType : true)
      expiredEvents.sort(sortDates)
      return changeFilteredEventsData(getEntityList([...expiredEvents, ...newFilteredEventsData]))
    } else {
      return changeFilteredEventsData(getEntityList(newFilteredEventsData.filter(eventData => eventData.activated !== false)))
    }
  }, [activeType, eventsData, activeEventType])


  return (
    <EntityList
      list={filteredEventsData}
      setActiveId={(id) => setLocation(`/events/${id}`)}
      hasColorIndicator={activeType === DATA_TYPES.PLANNED}
      hasIcons
      selectMode={selectMode}
      selectedIds={selectedIds}
      switchIsIdSelected={switchIsIdSelected}
    />
  )
}

export default EventsList
