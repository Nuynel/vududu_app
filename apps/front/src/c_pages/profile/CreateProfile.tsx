import {Box, Button, Card, CardHeader, Form, FormField, Heading, CardBody, TextInput, CardFooter} from 'grommet'
import SignOutButton from "../../d_widgets/SignOutButton";
import {useState} from "react";
import * as React from "react";
import {createProfile} from '../../g_shared/methods/api';
import {Link, useLocation} from "wouter";
import useGetInitialData from "../../f_entities/hooks/useGetInitialData";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import { Paths } from '../../g_shared/constants/routes';
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";

export enum PROFILE_TYPES {
  // CANINE_FEDERATION = 'CANINE_FEDERATION',
  // NATIONAL_BREED_CLUb = 'NATIONAL_BREED_CLUb',
  // CANINE_CLUB = 'CANINE_CLUB',
  KENNEL = 'KENNEL',
  BREEDER = 'BREEDER',
  // MALE_DOG_OWNER = 'MALE_DOG_OWNER',
}

const CreateProfile = () => {
  const [profileType, setProfileType] = useState<PROFILE_TYPES | null>(null)
  const [name, setName] = useState<string>('')
  const [isNameFilled, switchIsNameFilled] = useState<boolean>(false)
  const [canineFederationName, setCanineFederationName] = useState<string>('')
  const [nationalBreedClubName, setNationalBreedClubName] = useState<string>('')
  const [canineClubName, setCanineClubName] = useState<string>('')
  const [kennelName, setKennelName] = useState<string>('')
  const [, setLocation] = useLocation();


  const {isSmall} = useResponsiveGrid()
  const { getInitialData } = useGetInitialData()
  const {setAccessToken, saveAccessToken} = useProfileDataStore();

  const submit = () => {
    createProfile({
      name,
      type: profileType,
      connectedOrganisations: {
        canineFederation: canineFederationName || null,
        nationalBreedClub: nationalBreedClubName || null,
        canineClub: canineClubName || null,
        kennel: kennelName || null,
      }
    }).then(async (result: {accessToken: string}) => {
      const {accessToken} = result;
      setAccessToken(accessToken);
      saveAccessToken(accessToken);
    }).then(() => {
      return getInitialData()
    })
      .then(() => setLocation(Paths.events, {replace: true}))
  }


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
        <CardHeader >
          <Heading level={3} margin={{top: 'none'}}>
            {!profileType && 'Шаг 1 из 3'}
            {profileType && !isNameFilled && 'Шаг 2 из 3'}
            {profileType && isNameFilled && 'Шаг 3 из 3'}
          </Heading>
        </CardHeader>
        <CardBody>
          {!profileType && (
            <Box gap={"medium"}>
              <Button
                primary
                onClick={() => setProfileType(PROFILE_TYPES.KENNEL)}
                label={isSmall ? 'Добавить питомник' : 'Зарегистрироваться как питомник'}
              />
              <Button
                primary
                onClick={() => setProfileType(PROFILE_TYPES.BREEDER)}
                label={isSmall ? 'Добавить заводчика' : 'Зарегистрироваться как заводчик'}
              />
            </Box>
          )}

          {profileType && !isNameFilled && (
            <Box gap={'medium'}>
              <Form onSubmit={() => switchIsNameFilled(true)}>
                <FormField name='name' htmlFor="name-input-id" label={profileType === PROFILE_TYPES.KENNEL ? 'Название вашего питомника' : 'ФИО'}>
                  <TextInput
                    id="name-input-id"
                    placeholder={profileType === PROFILE_TYPES.KENNEL ? 'Василёк' : 'Иванов Иван Иванович'}
                    value={name}
                    onChange={event => setName(event.target.value)}
                  />
                </FormField>
                <Button fill={'horizontal'} primary type="submit" label={profileType === PROFILE_TYPES.KENNEL ? 'Сохранить название питомника' : 'Сохранить имя заводчика'}/>
              </Form>
              <Button primary onClick={() => setProfileType(null)} label='Назад'/>
            </Box>
          )}

          {profileType && isNameFilled && (
            <Box gap={"medium"}>
              <Form onSubmit={submit}>
                <FormField name='canineFederationName' htmlFor="canine-federation-name-input-id" label="Название кинологической федерации">
                  <TextInput
                    id="canine-federation-name-input-id"
                    placeholder='Российская кинологическая федерация'
                    value={canineFederationName}
                    onChange={event => setCanineFederationName(event.target.value)}
                  />
                </FormField>
                <FormField name='nationalBreedClubName' htmlFor="national-breed-club-name-input-id" label="Название национального клуба породы">
                  <TextInput
                    id="national-breed-club-name-input-id"
                    placeholder='НКА Немецкая овчарка'
                    value={nationalBreedClubName}
                    onChange={event => setNationalBreedClubName(event.target.value)}
                  />
                </FormField>
                <FormField name='canineClubName' htmlFor="canine-club-name-input-id" label="Название кинологического клуба">
                  <TextInput
                    id="canine-club-name-input-id"
                    placeholder='Клуб РОО КЦ "Март"'
                    value={canineClubName}
                    onChange={event => setCanineClubName(event.target.value)}
                  />
                </FormField>
                {profileType === PROFILE_TYPES.BREEDER && (
                  <FormField name='kennelName' htmlFor="kennel-name-input-id" label="Название питомника">
                    <TextInput
                      id="kennel-name-input-id"
                      placeholder='Василёк'
                      value={kennelName}
                      onChange={event => setKennelName(event.target.value)}
                    />
                  </FormField>
                )}
                <Button fill={"horizontal"} type="submit" primary label="Сохранить связанные организации" />
              </Form>
              <Button primary onClick={() => switchIsNameFilled(false)} label='Назад'/>
            </Box>
          )}
        </CardBody>

        <CardFooter margin={{top: 'medium'}} alignSelf={"end"} fill={'horizontal'}>
          <SignOutButton fill={true}/>
        </CardFooter>


        {/*<CardHeader>*/}
        {/*  <Heading level={2} margin={"medium"}>Вход</Heading>*/}
        {/*</CardHeader>*/}
        {/*<Form*/}
        {/*  onSubmit={handleSubmit}*/}
        {/*  style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}*/}
        {/*>*/}
        {/*  <FormField name='E-mail' htmlFor="email-input-id" label="E-mail">*/}
        {/*    <TextInput*/}
        {/*      id="email-input-id"*/}
        {/*      placeholder='email@gmail.com'*/}
        {/*      value={email}*/}
        {/*      onChange={event => setEmail(event.target.value)}*/}
        {/*    />*/}
        {/*  </FormField>*/}
        {/*  <FormField name='Password' htmlFor="password-input-id" label="Пароль">*/}
        {/*    <TextInput*/}
        {/*      id="password-input-id"*/}
        {/*      type='password'*/}
        {/*      placeholder='********'*/}
        {/*      value={password}*/}
        {/*      onChange={event => setPassword(event.target.value)}*/}
        {/*    />*/}
        {/*  </FormField>*/}
        {/*  <Button margin='small' type="submit" primary label="Вход" />*/}
        {/*</Form>*/}
        {/*<Link to="/sign-up" style={{display: 'flex', justifyContent: 'center'}}>*/}
        {/*  <Button secondary margin='xsmall'>*/}
        {/*    Регистрация*/}
        {/*  </Button>*/}
        {/*</Link>*/}
      </Card>
    </Box>
  )
}

export default CreateProfile
