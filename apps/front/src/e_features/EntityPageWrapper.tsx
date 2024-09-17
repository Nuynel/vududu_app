import * as React from "react";
import {CloseIcon, BackIcon} from "../g_shared/icons";
import useResponsiveGrid from "../f_entities/hooks/useResponsiveGrid";
import {ReactNode} from "react";

type Props = {
  children: ReactNode
  title: string,
  closeEntityPage: () => void,
}

const EntityPageWrapper = ({children, title, closeEntityPage}: Props) => {
  const {isSmall} = useResponsiveGrid()

  return (
    <div className="grid grid-rows-[60px_auto] lg:grid-rows-[90px_auto] grid-cols-[60px_auto_60px] h-full">
      {/* Кнопка "Назад" */}
      <div className="flex justify-center items-center border-b border-gray-200">
        <button
          className="w-12 h-12 bg-gray-200 rounded-full focus:outline-none"
          onClick={() => window.history.back()}
        >
          <BackIcon color='black' />
        </button>
      </div>

      {/* Заголовок */}
      <div className="flex justify-around items-center bg-white border-b border-gray-200">
        <h3 className="text-lg font-bold">
          {title}
        </h3>
      </div>

      {/* Кнопка "Закрыть" */}
      <div className="flex justify-center items-center border-b border-gray-200">
        <button
          className="w-12 h-12 bg-gray-200 rounded-full focus:outline-none"
          onClick={closeEntityPage}
        >
          <CloseIcon color='black' />
        </button>
      </div>

      {/* Контент */}
      <div className="col-span-3 row-start-2 overflow-auto">
        {children}
      </div>
    </div>
  )
}

export default EntityPageWrapper
