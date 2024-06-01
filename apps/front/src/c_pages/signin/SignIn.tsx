import * as React from "react";
import {Box, Form, FormField, TextInput, Button, Card, CardHeader, Heading, Spinner} from 'grommet';
import {Link, useSearch} from "wouter"
import useSignIn from "./useSignIn";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {Paths} from "../../g_shared/constants/routes";

const SignInScreen = () => {
  const {
    email,
    password,
    isLoading,
    setEmail,
    setPassword,
    handleSubmit,
  } = useSignIn();

  const {isSmall} = useResponsiveGrid()
  const search = useSearch();

  useEffect(() => {
    if (search === 'activated') toast.info('Профиль активирован!')
    if (search === 'passwordUpdated') toast.info('Пароль обновлен!')
    if (search === 'expired') toast.error('Срок действия ссылки истёк!')
  }, [search])

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
          <Heading level={2} margin={"medium"}>Вход</Heading>
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
          <FormField
            name='Password'
            htmlFor="password-input-id"
            label="Пароль"
          >
            <TextInput
              id="password-input-id"
              type='password'
              placeholder='********'
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </FormField>
          <Button margin='small' type="submit" primary>
            <Box direction={"row"} align={"center"} justify={"center"} gap={"medium"} height={"36px"}>
              Вход
              {isLoading && <Spinner color={'white'}/>}
            </Box>
          </Button>
        </Form>
        <Link to={Paths.sign_up} style={{display: 'flex', justifyContent: 'center'}}>
          <Button secondary margin='xsmall'>
            Регистрация
          </Button>
        </Link>
        <Link to={'/password-recovery'} style={{display: 'flex', justifyContent: 'center'}}>
          <Button secondary margin='xsmall'>
            Забыли пароль?
          </Button>
        </Link>
      </Card>
    </Box>
  )
}

export default SignInScreen
