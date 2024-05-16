import {Box, Text} from "grommet";
import * as React from "react";
import {getRuTranslate} from "../constants/translates";

const CommonField = ({fieldName, fieldValue}: {fieldName: string, fieldValue: string | boolean | string[] | null}) => (
  <Box height='min-content' style={{minHeight: 'unset'}}>
    <Text size='small' margin={{right:'xxsmall'}} weight='bold'>{getRuTranslate(fieldName)}:</Text>
    <Text truncate='tip' size='small'>{fieldValue}</Text>
  </Box>
)

export default CommonField;
