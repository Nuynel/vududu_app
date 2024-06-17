import {Box, Button, Grid, Text} from "grommet";
import {getRuTranslate} from "../../../g_shared/constants/translates";
import * as React from "react";
import {FieldData} from "../../../g_shared/types";
import {dogShortDataFields} from "../configurations";
import {getCommonFieldsConfig} from "../../../g_shared/methods/helpers/getCommonFieldsConfig";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";
import {useLocation} from "wouter";

type Props = {
  dogId: string,

}

const DogCard = ({dogId}: Props) => {
  const {getDogById, getBreedById} = useProfileDataStore();
  const {isSmall} = useResponsiveGrid()
  const [, setLocation] = useLocation();

  const getCardsConfig = (): FieldData[] => {
    const dog = getDogById(dogId);
    const breed = getBreedById(dog.breedId);
    const fields = isSmall ? ['fullName'] : dogShortDataFields
    return fields.map(fieldName => getCommonFieldsConfig(fieldName, dog, breed))
  }

  return (
    <Box
      gridArea={'secondaryFilter'}
    >
      <Box
        direction={"row"}
        pad={"small"}
      >
        {!isSmall && dogId && (
          <Box
            height={isSmall ? 'xsmall' :"small"}
            width={isSmall ? 'xsmall' : "small"}
            background={'#777777'}
            margin={{right: 'small'}}
          />
        )}
        {dogId && (
          <Box justify={isSmall ? 'start' : "around"}>
            {getCardsConfig().map((field, index) => {
                return (
                  <Grid
                    columns={isSmall ? ['1fr', '2fr'] : ['1fr', '1fr']}
                    key={index}
                    rows={['auto']}
                    areas={[
                      { name: 'title', start: [0, 0], end: [0, 0] },
                      { name: 'value', start: [1, 0], end: [1, 0] },
                    ]}
                  >
                    <Box gridArea={'title'} align={isSmall ? 'start' : "end"} pad={{right: 'small'}}>
                      <Text size='small' margin={{right:'xxsmall'}}>{getRuTranslate(field.key)}:</Text>
                    </Box>
                    <Box  gridArea={'value'}>
                      <Text truncate='tip' size='small' weight='bold'>{field.value}</Text>
                    </Box>
                  </Grid>
                )
              }
            )}
          </Box>
        )}
      </Box>
      {dogId && (
        <Box
          direction={"row"}
          align={"center"}
          justify={"around"}
        >
          <Button size={isSmall ? 'small' : 'medium'} primary onClick={() => setLocation(`/dogs/dog/${dogId}`)} label='Карточка собаки'/>
          <Button size={isSmall ? 'small' : 'medium'} primary onClick={() => setLocation(`/litters/litter/${getDogById(dogId).litterData?.id}`)} label='Карточка помета'/>
        </Box>
      )}
    </Box>
  )
}

export default DogCard
