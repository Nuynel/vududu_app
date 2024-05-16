import {newEventFormConfig} from "../formConfig";
import {Box, CheckBox, FormField, Select} from "grommet";
import {PERIODS} from "../constants";
import * as React from "react";

type RepeatFieldProps = {
  repeat: boolean,
  switchRepeat: () => void,
  frequencyInDays: number,
  changeFrequency: ((newFrequency: number) => void)
}

const RepeatField = ({repeat, switchRepeat, frequencyInDays, changeFrequency}: RepeatFieldProps) => {
  const fieldConfig
    = newEventFormConfig.repeat
  return (
    <Box pad='small' key={fieldConfig.id}>
      <CheckBox
        id={fieldConfig.id}
        label={fieldConfig.label}
        checked={repeat}
        onChange={switchRepeat}
      />
      {repeat && (
        <FormField htmlFor='frequency-input-id' label='Следующее событие будет запланировано через'>
          <Select
            id='frequency-input-id'
            name={fieldConfig.label}
            options={PERIODS}
            labelKey={'label'}
            value={PERIODS.find(per => per.value === frequencyInDays)}
            onChange={(event) => changeFrequency(event.value.value)}
          />
        </FormField>
      )}
    </Box>
  )
}

export default RepeatField
