import * as React from 'react'
import {Card, Button, CardBody, CardFooter, Layer} from "grommet";

type Props = {text: string, closePopup: () => void; deleteEntities: () => void}

const DeletePopup = ({closePopup, deleteEntities, text}: Props) => {
  return (
    <Layer
      full={true}
      modal={true}
      plain={false}
      background={{
        color: 'black',
        opacity: 'medium'
      }}
      style={{justifyContent: 'center', alignItems: 'center'}}
      onEsc={closePopup}
      onClickOutside={closePopup}
    >
      <Card pad={"medium"} background={'white'} margin={{horizontal: 'medium'}}>
        <CardBody margin={{bottom: 'small'}}>
          {text}
        </CardBody>
        <CardFooter justify={"around"}>
          <Button
            focusIndicator={false}
            label='Отмена'
            fill={false}
            style={{borderRadius: '24px'}}
            primary
            onClick={closePopup}
          />
          <Button
            focusIndicator={false}
            label='Удалить'
            fill={false}
            style={{borderRadius: '24px'}}
            primary
            onClick={deleteEntities}
          />
        </CardFooter>
      </Card>
    </Layer>
  )
}

export default DeletePopup
