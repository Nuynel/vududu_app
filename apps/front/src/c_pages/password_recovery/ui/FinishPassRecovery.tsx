import * as React from "react";
import {Box, Button, Card, CardBody, CardHeader, Form, FormField, Heading, Spinner, Text, TextInput} from "grommet";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";

type Props = {
  password: string,
  controlPassword: string,
  isRecoveryInitialized: null | boolean,
  isLoading:  null | boolean,
  setPassword: (newPass: string) => void,
  setControlPassword: (newPass: string) => void,
  updatePassword: () => void,
}

const FinishPassRecovery = (
  {
    password,
    controlPassword,
    isLoading,
    setPassword,
    setControlPassword,
    updatePassword
  }: Props
) => {
  const {isSmall} = useResponsiveGrid();

  return (
    <Box
      background={'dark-6'}
      justify={"center"}
      align={"center"}
      fill={true}
    >
      <Card
        background={'white'}
        margin={'large'}
        pad={"medium"}
        width={isSmall ? '90%' : "large"}
      >
        <CardHeader>
          <Heading level={2} margin={"medium"}>Восстановление пароля</Heading>
        </CardHeader>
        <Form
          onSubmit={updatePassword}
          style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}
        >
          <FormField
            name='Password'
            htmlFor="password-input-id"
            label="Пароль"
            info="Минимум 6 символов"
            validate={() => {
              if (password.length < 6) return 'Слишком короткий пароль'
            }}
            validateOn={"blur"}
          >
            <TextInput
              id="password-input-id"
              placeholder='********'
              type={"password"}
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </FormField>
          <FormField
            name='Repeat passwprd'
            htmlFor="repeat-password-input-id"
            label="Подтверждение пароля"
            validate={() => {
              if (password !== controlPassword) return 'Пароли не совпадают'
            }}
            validateOn={"blur"}
          >
            <TextInput
              id="epeat-password-input-id"
              placeholder='********'
              type={"password"}
              value={controlPassword}
              onChange={event => setControlPassword(event.target.value)}
            />
          </FormField>
          <Button margin='small' type="submit" primary>
            <Box direction={"row"} align={"center"} justify={"center"} gap={"medium"} height={"36px"}>
              Сохранить новый пароль
              {isLoading && <Spinner color={'white'}/>}
            </Box>
          </Button>
        </Form>
      </Card>
    </Box>
  )

}

export default FinishPassRecovery
