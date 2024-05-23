import {Button, Tip} from "grommet";
import * as React from "react";
import {EVENT_TYPE} from "../../../g_shared/types/event";

type ActivateButtonProps = {
  eventTypeFilter: EVENT_TYPE | null,
  activate: () => void
}

const ActivateButton = ({eventTypeFilter, activate}: ActivateButtonProps) => {
  if (eventTypeFilter === null) {
    return (
      <Tip content={"Выберите тип события в фильтре"}>
        <Button
          focusIndicator={false}
          label='Активировать'
          fill={false}
          margin={{right: 'small'}}
          style={{borderRadius: '24px', color: "white", opacity: 0.5}}
          primary
          onClick={() => {}}
        />
      </Tip>
    )
  }
  return (
    <Button
      focusIndicator={false}
      label='Активировать'
      fill={false}
      margin={{right: 'small'}}
      style={{borderRadius: '24px', color: "white"}}
      primary
      onClick={activate}
    />
  )
}

export default ActivateButton
