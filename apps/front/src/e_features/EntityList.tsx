import {Box, Card, CardHeader, CheckBox, InfiniteScroll, Text} from "grommet";
import {formatDateOrRange, getDateDiff} from "../g_shared/methods/helpers";
import * as React from "react";
import {EVENT_TYPE} from "../g_shared/types/event";
import {BugIcon, FemaleIcon, InjectorIcon, MaleIcon, WaterIcon} from "../g_shared/icons";
import {GENDER} from "../g_shared/types/dog";

import {BorderType} from "grommet/utils";
import useResponsiveGrid from "../f_entities/hooks/useResponsiveGrid";

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
  date: string[],
}

type Props = {
  list: Entity[],
  hasColorIndicator: boolean,
  hasIcons: boolean,
  selectedIds?: string[],
  selectMode?: boolean,
  setActiveId: (_id: string) => void,
  switchIsIdSelected?: (_id: string) => void,
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

const getBorderSideAndSize = (dateDiff: number): {side: 'all' | 'left', size: 'small' | 'medium'} => {
  return dateDiff < 0 ? {side: 'all', size: 'small'} : {side: 'left', size: 'medium'}
}

const getIconComponent = (iconType: keyof typeof iconsMapping) => {
  const {icon: IconComponent, color} = iconsMapping[iconType]
  return <IconComponent color={color}/>
}

const getBorder = (hasColorIndicator: boolean, date: string[]): BorderType => {
  const dateDiff = getDateDiff(date[0])
  const borderSideAndSize = getBorderSideAndSize(dateDiff)
  return hasColorIndicator ? {...borderSideAndSize, color: getBorderColor(dateDiff), style: 'solid'} : false
}

const EntityList = ({list, hasColorIndicator, hasIcons, setActiveId, selectedIds, switchIsIdSelected, selectMode}: Props) => {
  const {isSmall} = useResponsiveGrid()

  const cardClickEventHandler = (id: string) => {
    if (!selectMode) setActiveId(id)
  }

  const getMargin = (index, list) => {
    if (index === (list.length - 1)) return {bottom: '72px', top: isSmall ? 'medium' : 'small', left: 'small', right: 'small'}
    return {bottom: 'none', top: isSmall ? 'medium' : 'small', left: 'small', right: 'small'}
  }

  return (
    <InfiniteScroll items={list}>
      {(entity: Entity, index: number) => {
        return (
          <Card
            background={'white'}
            focusIndicator={false}
            pad={isSmall ? 'medium' : 'small'}
            margin={getMargin(index, list)}
            flex={false}
            key={index}
            onClick={() => cardClickEventHandler(entity._id)}
            border={getBorder(hasColorIndicator, entity.date)}
          >
            <CardHeader justify='between'>
              <Box direction='row' gap={'medium'}>
                {selectMode && (
                  <CheckBox
                    checked={selectedIds.includes(entity._id)}
                    onChange={() => switchIsIdSelected(entity._id)}
                  />
                )}
                {hasIcons && entity.icon && getIconComponent(entity.icon)}
                <Text truncate margin={{left: 'small'}}>
                  {entity.title}
                </Text>
              </Box>
              <Text style={{maxWidth: 'min-content'}}>
                {formatDateOrRange(entity.date)}
              </Text>
            </CardHeader>
          </Card>
        )
      }}
    </InfiniteScroll>
  )
}

export default EntityList
