import {newDogEventFormConfig} from "../formConfig";
import {FormField} from "grommet";
import {EVENT_TYPE} from "../../../g_shared/types/event";
import * as React from "react";

type EventTypeSelectorProps = {
  newEventType: EVENT_TYPE,
  changeNewEventType: (newEventType: EVENT_TYPE) => void
}

const EventTypeSelector = ({newEventType, changeNewEventType}: EventTypeSelectorProps) => {
  const fieldConfig
    = newDogEventFormConfig.eventType
  const Field = fieldConfig.component
  return (
    <FormField key={fieldConfig.id} name={fieldConfig.label} htmlFor={fieldConfig.id} label={fieldConfig.label}>
      <Field
        id={fieldConfig.id}
        name={fieldConfig.label}
        value={newEventType}
        options={fieldConfig.options}
        onChange={({target}) => changeNewEventType(target.value as EVENT_TYPE)}
      />
    </FormField>
  )
}

export default EventTypeSelector
