import * as React from "react";
import {Link} from "wouter";
import {Box, Button, Card, CardHeader, Form, FormField, Heading, Spinner, TextInput} from "grommet";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";


type Props = {
  email: string,
  isLoading:  null | boolean,
  setEmail: (newEmail: string) => void,
  handleSubmit: () => void,
}
const StartPassRecovery = ({email, isLoading, setEmail, handleSubmit}: Props) => {
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
          onSubmit={handleSubmit}
          style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}
        >
          <FormField
            name='E-mail'
            htmlFor="email-input-id"
            label="E-mail"
            validate={() => {
              if (!email) return 'Введите адрес электронной почты'
            }}
          >
            <TextInput
              id="email-input-id"
              placeholder='email@gmail.com'
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </FormField>
          <Button margin='small' type="submit" primary>
            <Box direction={"row"} align={"center"} justify={"center"} gap={"medium"} height={"36px"}>
              Восстановить пароль
              {isLoading && <Spinner color={'white'}/>}
            </Box>
          </Button>
        </Form>
        <Link to="/sign-in" style={{display: 'flex', justifyContent: 'center'}}>
          <Button secondary margin='xsmall'>
            Вход
          </Button>
        </Link>
      </Card>
    </Box>
  )

}

export default StartPassRecovery
