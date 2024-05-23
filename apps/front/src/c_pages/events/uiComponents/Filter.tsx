import * as React from 'react'
import {Box, FormField, Select, Text} from "grommet";
import {EVENT_TYPE} from "../../../g_shared/types/event";
import {useUIStateStore} from "../../../f_entities/store/uiStateStoreHook";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";

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

const Filter = () => {
  const {eventTypeFilter, setEventTypeFilter} = useUIStateStore()
  const {isSmall} = useResponsiveGrid()
  return (
    <Box
      gridArea={'secondaryFilter'}
      alignSelf='center'
      justify={isSmall ? 'around' : 'end'}
      style={{ padding: '0 5vw 0' }}
      background={'white'}
      direction={'row'}
      height={isSmall ? 'auto' : '70px'}
      border={{color: '#F1F5F8', side: 'bottom', size: 'small', style: 'solid'}}
    >
      <Text size={'medium'} margin={{right: 'large', top: 'medium', bottom: 'small'}}>
        Фильтр
      </Text>
      <FormField htmlFor='filter-input-id' margin={{top: 'small'}}>
        <Select
          id='filter-input-id'
          name='Фильтр'
          value={eventTypeOptions.find((option) => option.value === eventTypeFilter)}
          options={eventTypeOptions}
          labelKey='label'
          placeholder='Фильтр'
          onChange={(event) => setEventTypeFilter(event.value.value)}
        />
      </FormField>
    </Box>
  )
}

export default Filter
