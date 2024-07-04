import * as React from 'react'
import {Card, Button, CardBody, CardFooter, Layer} from "grommet";

type Props = {text: string, submitButtonText?: string, closePopup: () => void; submitAction?: () => void}

const SubmitActionPopup = ({closePopup, submitAction, text, submitButtonText}: Props) => {
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
            label='Закрыть'
            fill={false}
            style={{borderRadius: '24px'}}
            primary
            onClick={closePopup}
          />
          {submitButtonText && (
            <Button
              focusIndicator={false}
              label={submitButtonText}
              fill={false}
              style={{borderRadius: '24px'}}
              primary
              onClick={submitAction}
            />
          )}
        </CardFooter>
      </Card>
    </Layer>
  )
}

export default SubmitActionPopup
