import * as React from "react";
import {Box, Form, FormField, TextInput, Button, Card, CardHeader, Heading, Spinner} from 'grommet';
import {Link} from "wouter";
import useSignUp from "./useSignUp";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";

const SignUpScreen = () => {
  const {
    email,
    password,
    controlPassword,
    isLoading,
    setEmail,
    setPassword,
    setControlPassword,
    handleSubmit,
  } = useSignUp();

  const {isSmall} = useResponsiveGrid()

  return (
    <Box
      background={'dark-6'}
      justify={"center"}
      align={"center"}
      fill={true}
    >
      <Card
        background={'white'}
        margin='large'
        pad={"medium"}
        width={isSmall ? '90%' : "large"}
      >
        <CardHeader>
          <Heading level={2} margin={"medium"}>Регистрация</Heading>
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
              if (!email.includes('@') || email.includes(' ') || !email.includes('.')) return 'Невалидный e-mail'
            }}
            validateOn={"blur"}
          >
            <TextInput
              id="email-input-id"
              placeholder='email@email.com'
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </FormField>
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
              Зарегистрироваться
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
  );
}

export default SignUpScreen


