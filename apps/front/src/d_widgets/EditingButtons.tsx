import * as React from 'react'
import {Box, Button} from "grommet";
import {PencilIcon, PlusIcon, TrashIcon} from "../g_shared/icons";
import useResponsiveGrid from "../f_entities/hooks/useResponsiveGrid";

type Props = {
  isEditingModeActive: boolean,
  children: React.ReactNode,
  switchEditingMode: () => void,
  showPopup: () => void,
}

const EditingButtons = ({isEditingModeActive, children, switchEditingMode, showPopup}: Props) => {
  const {isSmall} = useResponsiveGrid()
  const getBlockWidth = () => {
    return isSmall ? '100%' : window.innerWidth - 250
  }

  return (
    <Box
      direction={"row"}
      justify={"between"}
      pad={{horizontal: 'medium'}}
      style={{height: '48px', width: getBlockWidth(), position: "absolute", bottom: isSmall ? 72 : 24}}
    >
      <Box direction={"row"} gap={'medium'}>
        <Button
          focusIndicator={false}
          icon={<PencilIcon color='white' />}
          fill={false}
          style={{width: '48px', borderRadius: '24px'}}
          primary
          onClick={switchEditingMode}
        />
        {isEditingModeActive && (
          <Button
            focusIndicator={false}
            icon={<TrashIcon color='white' />}
            fill={false}
            style={{width: '48px', borderRadius: '24px'}}
            primary
            onClick={showPopup}
          />
        )}

        {children}

      </Box>
      <Button
        disabled={isEditingModeActive}
        focusIndicator={false}
        icon={<PlusIcon color='white' />}
        fill={false}
        style={{width: '48px', borderRadius: '24px'}}
        primary
        onClick={showPopup}
      />
    </Box>
  )
}

export default EditingButtons
