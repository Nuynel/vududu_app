import {Box, FormField, Select, Text} from "grommet";
import * as React from "react";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";
import {DogData} from "../../../g_shared/types";
import {useEffect, useState} from "react";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";

type Props = {
  probandId: string,
  changeProbandId: (id: string) => void,
}

const ProbandSelect = ({probandId, changeProbandId}: Props) => {
  const {isSmall} = useResponsiveGrid(true);
  const [dogsList, changeDogsList] = useState<DogData[]>([])
  const {dogsData} = useProfileDataStore();

  const getDogs = (searchString: string) => {
    return dogsData.filter(dogData => dogData.fullName.toLowerCase().includes(searchString.toLowerCase()) || dogData.name.toLowerCase().includes(searchString.toLowerCase()))
  }
  const handleSearch = (searchString: string) => changeDogsList(getDogs(searchString))

  useEffect(() => {
    changeDogsList(dogsData)
  }, [dogsData])

  return (
    <Box
      gridArea={'mainFilter'}
      alignSelf='center'
      justify={'around'}
      background={'white'}
      pad={'small'}
      direction={"row"}
    >
      <Box>
        <Text size={'small'} margin={{right: 'large', top: 'medium', bottom: 'small'}}>
          Пробанд
        </Text>
      </Box>
      <FormField htmlFor='filter-input-id' margin={{top: 'small'}}>
        <Select
          id='filter-input-id'
          name='Фильтр'
          value={dogsList.find((dogData) => dogData._id === probandId)}
          options={dogsList}
          labelKey='fullName'
          placeholder='Фильтр'
          size={"small"}
          // border={{color: '#777777', side: 'all', size: 'xsmall', style: 'solid'}}
          onSearch={(searchString) => handleSearch(searchString)}
          onChange={(event) => changeProbandId(event.value._id)}
        />
      </FormField>
    </Box>
  )
}

export default ProbandSelect
