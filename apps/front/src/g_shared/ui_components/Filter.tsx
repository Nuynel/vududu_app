import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import * as React from "react";
import {EVENT_TYPE} from "../types/event";
import {CustomSelect} from '../ui_components';

type Props = {
  options: {
    label: string,
    value: null | EVENT_TYPE | string
  }[],
  value: null | EVENT_TYPE | string,
  setValue: (newValue: null | EVENT_TYPE | string) => void
}

const Filter = ({options, value, setValue}: Props) => {
  const {isSmall} = useResponsiveGrid()
  return (
    <div
      className={`flex rounded-xl ${isSmall ? 'justify-around' : 'justify-end'} items-center w-full bg-white py-4 px-6`}
      // style={{ padding: '0 5vw', height: isSmall ? 'auto' : '70px', borderBottom: '1px solid #F1F5F8' }}
    >
      <p className="text-md mr-2">
        Фильтр
      </p>
      <div>
        <CustomSelect options={options} value={value} onChange={setValue} onBlur={() => {}} />
      </div>
    </div>
  )
}

export default Filter
