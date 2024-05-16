import {Box, Button, Text} from "grommet";
import {getRuTranslate} from "../constants/translates";
import * as React from "react";
import {OpenIcon} from "../icons";

type Props = {
  fieldName: string,
  fieldValue: string | boolean | string[] | null,
  redirectFunc: () => void,
}

const LinkedField = ({fieldName, fieldValue, redirectFunc}: Props) => (
  <Box justify={'between'} direction={"row"}>
    <Box direction='column'>
      <Text size='small' margin={{right:'xxsmall'}} weight='bold'>{getRuTranslate(fieldName)}:</Text>
      <Text truncate='tip' size='small'>{fieldValue}</Text>
    </Box>
    <Box gridArea='exit' height={'100%'} justify={"center"} align={'center'}>
      <Button
        focusIndicator={false}
        icon={<OpenIcon color='black'/>}
        fill={false}
        style={{width: '48px', borderRadius: '24px'}}
        secondary
        onClick={redirectFunc}
      />
    </Box>
  </Box>
)

export default LinkedField;
