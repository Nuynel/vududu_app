import * as React from 'react'
import {useEffect, useState} from 'react'
import {DATA_TYPES, EVENT_TYPE, IncomingEventData} from "../../g_shared/types/event";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import EntityList, {Entity} from "../../e_features/EntityList";
import {compareDates, sortDates} from "../../g_shared/methods/helpers";
import {useLocation} from "wouter";
import {Paths} from "../../g_shared/constants/routes";
import ActivateButton from "./uiComponents/ActivateButton";
import EditingButtons from "../../d_widgets/EditingButtons";
import {useUIStateStore} from "../../f_entities/store/uiStateStoreHook";

type Props = {
  activeType: DATA_TYPES,
  selectedIds: string[],
  switchIsIdSelected: (id) => void,
  showPopup: (value: boolean) => void,
}

const EventsList = ({activeType, selectedIds, switchIsIdSelected, showPopup}: Props) => {
  const { eventsData, dogsData } = useProfileDataStore()
  const [, setLocation] = useLocation();
  const [massEditing, switchEditingMode] = useState<boolean>(false)
  const {eventTypeFilter} = useUIStateStore()

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
      .filter(eventData => eventTypeFilter ? eventData.eventType === eventTypeFilter : true)
    newFilteredEventsData.sort(sortDates)
    if (activeType === DATA_TYPES.PLANNED) {
      const expiredEvents = eventsData
        .filter(eventData => (new Date(eventData.date[0]) < new Date() && eventData.activated === false))
        .filter(eventData => eventTypeFilter ? eventData.eventType === eventTypeFilter : true)
      expiredEvents.sort(sortDates)
      return changeFilteredEventsData(getEntityList([...expiredEvents, ...newFilteredEventsData]))
    } else {
      return changeFilteredEventsData(getEntityList(newFilteredEventsData.filter(eventData => eventData.activated !== false)))
    }
  }, [activeType, eventsData, eventTypeFilter])


  return (
    <div className='relative'>
      <EntityList
        list={filteredEventsData}
        setActiveId={(id) => setLocation(`/app/events/${id}`)}
        hasColorIndicator={activeType === DATA_TYPES.PLANNED}
        hasIcons
        selectMode={massEditing}
        selectedIds={selectedIds}
        switchIsIdSelected={switchIsIdSelected}
        openCreator={() => setLocation(Paths.event_creator)}
        addButtonText={'addFirstEvent'}
      />

      <EditingButtons
        isListEmpty={!filteredEventsData.length}
        isEditingModeActive={massEditing}
        switchEditingMode={() => switchEditingMode(!massEditing)}
        showPopup={() => showPopup(true)}
        openCreator={() => setLocation(Paths.event_creator)}
      >
        {massEditing && <ActivateButton eventTypeFilter={eventTypeFilter} activate={() => {}}/>}
      </EditingButtons>
    </div>
  )
}

export default EventsList
