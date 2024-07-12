import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import {Box, FormField, Select, Text} from "grommet";
import * as React from "react";
import {EVENT_TYPE} from "../types/event";

type Props = {
  options: {
    label: string,
    value: null | EVENT_TYPE | string
  }[],
  value: null | EVENT_TYPE | string,
  setValue: (newValue: null | EVENT_TYPE | string) => void
}

const Filter = ({options, value, setValue}: Props) => {
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
          value={options.find((option) => option.value === value)}
          options={options}
          labelKey='label'
          placeholder='Фильтр'
          onChange={(event) => setValue(event.value.value)}
        />
      </FormField>
    </Box>
  )
}

export default Filter
