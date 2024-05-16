import * as React from 'react'
import AddNewEventForm from "../AddNewEventForm";
import {Box, Button, Layer} from "grommet";
import {CloseIcon} from "../../../g_shared/icons";

type Props = {close: () => void}

const NewEventForm = ({close}: Props) => {
  return (
    <Layer
      onEsc={close}
      onClickOutside={close}
    >
      <AddNewEventForm hideCard={close} />
      <Box style={{height: '48px', position: "absolute", top: 16, right: 20}}>
        <Button
          focusIndicator={false}
          icon={<CloseIcon color='white' />}
          fill={false}
          style={{width: '48px', borderRadius: '24px'}}
          primary
          onClick={close}
        />
      </Box>
    </Layer>
  )
}

export default NewEventForm
