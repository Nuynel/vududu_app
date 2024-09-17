import * as React from "react";
import {EVENT_TYPE} from "../../../g_shared/types/event";

type ActivateButtonProps = {
  eventTypeFilter: EVENT_TYPE | null,
  activate: () => void
}

const ActivateButton = ({eventTypeFilter, activate}: ActivateButtonProps) => {
  if (eventTypeFilter === null) {
    return (
      <div className="relative group">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-full opacity-50 focus:outline-none mr-2"
          onClick={() => {}}
        >
          Активировать
        </button>
        <div className="absolute hidden group-hover:block bg-gray-700 text-white text-sm rounded-md p-2 mt-1">
          Выберите тип события в фильтре
        </div>
      </div>

      // <Tip content={"Выберите тип события в фильтре"}>
      //   <Button
      //     focusIndicator={false}
      //     label='Активировать'
      //     fill={false}
      //     margin={{right: 'small'}}
      //     style={{borderRadius: '24px', color: "white", opacity: 0.5}}
      //     primary
      //     onClick={() => {}}
      //   />
      // </Tip>
    )
  }
  return (
    <button
      onClick={activate}
      className="bg-blue-500 text-white py-2 px-4 rounded-full focus:outline-none mr-2"
    >
      Активировать
    </button>

    // <Button
    //   focusIndicator={false}
    //   label='Активировать'
    //   fill={false}
    //   margin={{right: 'small'}}
    //   style={{borderRadius: '24px', color: "white"}}
    //   primary
    //   onClick={activate}
    // />
  )
}

export default ActivateButton
