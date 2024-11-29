import {formatDateOrRange, getDateDiff} from "../g_shared/methods/helpers";
import * as React from "react";
import {EVENT_TYPE} from "../g_shared/types/event";
import {BugIcon, FemaleIcon, InjectorIcon, MaleIcon, WaterIcon} from "../g_shared/icons";
import {GENDER} from "../g_shared/types/dog";
import {CustomSpinner, InfiniteScroll} from '../g_shared/ui_components'
import useResponsiveGrid from "../f_entities/hooks/useResponsiveGrid";
import {useTranslation} from "../f_entities/contexts/i18n";

const colors = {
  red: 'red',
  orange: 'orange',
  yellow: 'yellow',
  green: 'green',
  blue: 'lightBlue',
  darkBlue: 'blue',
}

const DAY = 1000*60*60*24

const periods = {
  twoDays: DAY*2,
  oneWeek: DAY*7,
  oneMonth: DAY*28,
  twoMonth: DAY*56,
}

export type Entity = {
  _id: string,
  icon: keyof typeof iconsMapping | null,
  title: string,
  date?: string[],
  hasOwner?: boolean,
}

type Props = {
  list: Entity[],
  hasColorIndicator: boolean,
  hasIcons: boolean,
  selectedIds?: string[],
  selectMode?: boolean,
  isDogChooser?: boolean,
  setActiveId: (_id: string) => void,
  switchIsIdSelected?: (_id: string) => void,
  openCreator?: () => void,
  addButtonText?: string
}

const iconsMapping = {
  [EVENT_TYPE.ANTIPARASITIC_TREATMENT]: {
    icon: BugIcon,
    color: '#3D138D'
  },
  [EVENT_TYPE.HEAT]: {
    icon: WaterIcon,
    color: '#A2423D'
  },
  [EVENT_TYPE.VACCINATION]: {
    icon: InjectorIcon,
    color: '#00662E'
  },
  [GENDER.MALE]: {
    icon: MaleIcon,
    color: 'black'
  },
  [GENDER.FEMALE]: {
    icon: FemaleIcon,
    color: 'black'
  },
}

const getBorderColor = (dateDiff: number) => {
  if (dateDiff < 0) return colors.red
  if (dateDiff < periods.twoDays) return colors.orange
  if (dateDiff < periods.oneWeek) return colors.yellow
  if (dateDiff < periods.oneMonth) return colors.green
  if (dateDiff < periods.twoMonth) return colors.blue
  return colors.darkBlue
}

const getBorderSideAndSize = (dateDiff: number): {border: string} | {borderLeft: string} => {
  return dateDiff < 0
    ? {border: '1px solid'} // small border
    : {borderLeft: '2px solid'} // medium border on the left
}

const getIconComponent = (iconType: keyof typeof iconsMapping) => {
  const {icon: IconComponent, color} = iconsMapping[iconType]
  return <IconComponent color={color}/>
}

const getBorder = (hasColorIndicator: boolean, date: string[]): React.CSSProperties | undefined => {
  const dateDiff: number = getDateDiff(date[0])
  const borderSideAndSize = getBorderSideAndSize(dateDiff)
  const borderColor = getBorderColor(dateDiff)

  return hasColorIndicator ? {
    ...borderSideAndSize,
    borderColor: borderColor,
  } : undefined
}

const EntityList = ({list, hasColorIndicator, hasIcons, setActiveId, selectedIds, isDogChooser, switchIsIdSelected, selectMode, openCreator, addButtonText}: Props) => {
  const {isSmall} = useResponsiveGrid()
  const {translate} = useTranslation()

  const cardClickEventHandler = (id: string) => {
    if (!selectMode) setActiveId(id)
  }

  if (!list.length && openCreator) return (
    <div className={`flex rounded-xl justify-around w-full bg-white p-4 h-full ${isSmall ? 'items-center' : 'items-start'}`}>
      <button
        onClick={openCreator}
        className={`w-full bg-green-400 hover:bg-green-500 text-white px-4 flex justify-center text-xl items-center ${isSmall ? 'py-12 rounded-xl' : 'py-2 rounded-full'}`}
      >
        {translate(addButtonText)}
      </button>
    </div>
  )

  return (
    <InfiniteScroll items={list}>
      {(entity: Entity, index: number) => {
        return isDogChooser ? (
          <div
            className={`bg-white ${isSmall ? 'p-4' : 'p-2'} rounded-xl shadow-md`}
            key={index}
          >
            <div className={`flex ${isSmall ? 'flex-col items-center' : 'flex-row justify-between items-center'}`}>
              {/* Заголовок и информация */}
              <div className="flex flex-row gap-4">
                <p className={`truncate ${!isSmall ? 'ml-2' : ''}`}>
                  {entity.title}
                  {entity.hasOwner && ', собака уже закреплена за владельцем'}
                </p>
              </div>
              {/* Кнопка */}
              <button
                className={`${
                  isSmall ? 'text-sm mt-3 px-2 py-1' : 'text-md px-3 py-2'
                } ${entity.hasOwner ? 'bg-red-500' : 'bg-blue-500'} text-white font-semibold rounded-md`}
                onClick={() => cardClickEventHandler(entity._id)}
              >
                {entity.hasOwner ? 'Оспорить владение' : 'Это моя собака'}
              </button>
            </div>
          </div>
          ) : (
          <div
            className={`bg-white ${isSmall ? 'p-4' : 'p-2'} rounded-xl shadow-md cursor-pointer`}
            key={index}
            onClick={() => cardClickEventHandler(entity._id)}
            style={getBorder(hasColorIndicator, entity.date)}
          >
            {/* Заголовок карточки */}
            <div className={`grid grid-rows-[auto] ${selectMode ? 'grid-cols-[30px_30px_1fr_auto]' : hasIcons ? 'grid-cols-[30px_1fr_auto]' : 'grid-cols-[1fr_auto]'}`}>
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(entity._id)}
                  onChange={() => switchIsIdSelected(entity._id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              )}
              {hasIcons && entity.icon && getIconComponent(entity.icon)}
              <div className="ml-2 truncate">
                {entity.title}
              </div>
              <div>
                {formatDateOrRange(entity.date)}
              </div>
            </div>
          </div>
        )
      }}
    </InfiniteScroll>
  )
}

export default EntityList
