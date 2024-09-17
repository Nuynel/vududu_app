import {getRuTranslate} from "../constants/translates";
import * as React from "react";
import {OpenIcon} from "../icons";

type Props = {
  fieldName: string,
  fieldValue: string | boolean | string[] | null,
  redirectFunc: () => void,
}

const LinkedField = ({fieldName, fieldValue, redirectFunc}: Props) => (
  <div className="flex justify-between items-center">
    {/* Левый блок с текстом */}
    <div className="flex flex-col">
      <p className="text-sm font-bold mr-1">
        {getRuTranslate(fieldName)}:
      </p>
      <p className="text-sm truncate">
        {fieldValue}
      </p>
    </div>

    {/* Блок с кнопкой */}
    <div className="flex items-center justify-center">
      <button
        className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center focus:outline-none"
        onClick={redirectFunc}
      >
        <OpenIcon color='black' />
      </button>
    </div>
  </div>

  // <Box justify={'between'} direction={"row"}>
  //   <Box direction='column'>
  //     <Text size='small' margin={{right:'xxsmall'}} weight='bold'>{getRuTranslate(fieldName)}:</Text>
  //     <Text truncate='tip' size='small'>{fieldValue}</Text>
  //   </Box>
  //   <Box gridArea='exit' height={'100%'} justify={"center"} align={'center'}>
  //     <Button
  //       focusIndicator={false}
  //       icon={<OpenIcon color='black'/>}
  //       fill={false}
  //       style={{width: '48px', borderRadius: '24px'}}
  //       secondary
  //       onClick={redirectFunc}
  //     />
  //   </Box>
  // </Box>
)

export default LinkedField;
