import {CloseIcon} from "../g_shared/icons";
import * as React from "react";
import {ReactNode} from "react";

type Props = {
  children: ReactNode
  title: string,
  isNewDogCreator?: boolean,
}

const FormPageWrapper = ({children, title}: Props) => {

  return (
    <div className="grid grid-rows-[60px_auto] grid-cols-[60px_auto_60px] h-full">
      {/* Кнопка закрытия */}
      <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex justify-center items-center h-full">
        <button
          className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center focus:outline-none"
          onClick={() => window.history.back()}
        >
          <CloseIcon color='black' />
        </button>
      </div>

      {/* Заголовок */}
      <div className="col-start-2 col-end-3 row-start-1 row-end-2 flex justify-around items-center bg-white border-b border-gray-200">
        <h3 className="text-xl font-bold my-2">
          {title}
        </h3>
      </div>

      {/* Контент */}
      <div className="col-start-1 col-end-4 row-start-2 row-end-3 overflow-scroll gap-2 bg-white">
        {children}
      </div>
    </div>
  )
}

export default FormPageWrapper
