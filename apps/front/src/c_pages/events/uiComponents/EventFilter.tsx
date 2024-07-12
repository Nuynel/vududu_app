import * as React from 'react'
import {EVENT_TYPE} from "../../../g_shared/types/event";
import {useUIStateStore} from "../../../f_entities/store/uiStateStoreHook";
import Filter from "../../../g_shared/ui_components/Filter";

const eventTypeOptions = [
  {
    label: 'Все',
    value: null
  },
  {
    label: 'Вакцинации',
    value: EVENT_TYPE.VACCINATION
  },
  {
    label: 'Обработки',
    value: EVENT_TYPE.ANTIPARASITIC_TREATMENT
  },
  {
    label: 'Течки',
    value: EVENT_TYPE.HEAT
  },
]

const EventFilter = () => {
  const {eventTypeFilter, setEventTypeFilter} = useUIStateStore()
  return (
    <Filter
      options={eventTypeOptions}
      value={eventTypeFilter}
      setValue={setEventTypeFilter}
    />
  )
}

export default EventFilter
