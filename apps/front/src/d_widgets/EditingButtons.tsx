import * as React from 'react'
import {PencilIcon, PlusIcon, TrashIcon} from "../g_shared/icons";
import useResponsiveGrid from "../f_entities/hooks/useResponsiveGrid";

type Props = {
  isEditingModeActive: boolean,
  isListEmpty?: boolean,
  children?: React.ReactNode,
  switchEditingMode: () => void,
  showPopup: () => void,
  openCreator: () => void,
}

const EditingButtons = ({isEditingModeActive, children, switchEditingMode, showPopup, openCreator, isListEmpty}: Props) => {
  const {isSmall} = useResponsiveGrid()

  // function isStandalone() {
  //   // @ts-ignore: next line
  //   return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  // }

  return (
    <div
      className={`absolute bottom-4 flex justify-between items-center px-4 w-full`}
    >
      <div className="flex gap-4">
        {/* Кнопка редактирования */}
        {!isListEmpty && (<button
          className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
          onClick={switchEditingMode}
        >
          <PencilIcon color="white"/>
        </button>)}

        {/* Кнопка удаления, если активен режим редактирования */}
        {isEditingModeActive && (
          <button
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
            onClick={showPopup}
          >
            <TrashIcon color="white" />
          </button>
        )}

        {/* Другие элементы */}
        {children}
      </div>

      {/* Кнопка добавления */}
      {!isListEmpty && (
        <button
          className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
          onClick={openCreator}
          disabled={isEditingModeActive}
        >
          <PlusIcon color="white"/>
        </button>
      )}
    </div>
  )
}

export default EditingButtons
