import * as React from 'react'
import {PencilIcon, PlusIcon, TrashIcon} from "../g_shared/icons";
import useResponsiveGrid from "../f_entities/hooks/useResponsiveGrid";

type Props = {
  isEditingModeActive: boolean,
  children?: React.ReactNode,
  switchEditingMode: () => void,
  showPopup: () => void,
  openCreator: () => void,
}

const EditingButtons = ({isEditingModeActive, children, switchEditingMode, showPopup, openCreator}: Props) => {
  const {isSmall} = useResponsiveGrid()
  const getBlockWidth = () => {
    return isSmall ? '100%' : window.innerWidth - 250
  }

  function isStandalone() {
    // @ts-ignore: next line
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  return (
    <div
      className={`flex justify-between items-center px-4`}
      style={{
        height: '48px',
        width: getBlockWidth(),
        position: 'absolute',
        bottom: isSmall ? (isStandalone ? '92px' : '72px') : '24px',
      }}
    >
      <div className="flex gap-4">
        {/* Кнопка редактирования */}
        <button
          className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
          onClick={switchEditingMode}
        >
          <PencilIcon color="white" />
        </button>

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
      <button
        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
        onClick={openCreator}
        disabled={isEditingModeActive}
      >
        <PlusIcon color="white" />
      </button>
    </div>
  )
}

export default EditingButtons
