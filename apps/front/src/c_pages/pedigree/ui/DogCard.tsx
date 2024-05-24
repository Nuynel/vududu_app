import {Box, Grid, Text} from "grommet";
import {getRuTranslate} from "../../../g_shared/constants/translates";
import * as React from "react";
import {FieldData} from "../../../g_shared/types";
import {dogShortDataFields} from "../configurations";
import {getCommonFieldsConfig} from "../../../g_shared/methods/helpers/getCommonFieldsConfig";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";

type Props = {
  probandId: string,

}

const DogCard = ({probandId}: Props) => {
  const {getDogById} = useProfileDataStore();

  const getCardsConfig = (): FieldData[] => {
    const dog = getDogById(probandId);
    return dogShortDataFields.map(fieldName => getCommonFieldsConfig(fieldName, dog))
  }

  return (
    <Box
      gridArea={'secondaryFilter'}
      direction={"row"}
      pad={"small"}
    >
      <Box height={"small"} width={"small"} background={'#777777'} margin={{right: 'small'}}/>
      <Box justify={"around"}>
        {probandId && getCardsConfig().map((field, index) => {
            return (
              <Grid
                columns={['1fr', '1fr']}
                key={index}
                rows={['auto']}
                areas={[
                  { name: 'title', start: [0, 0], end: [0, 0] },
                  { name: 'value', start: [1, 0], end: [1, 0] },
                ]}
              >
                <Box gridArea={'title'} align={"end"} pad={{right: 'small'}}>
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
    </Box>
  )
}

export default DogCard
