import * as React from "react";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Text,
  Grid,
  Accordion,
  AccordionPanel,
  Button,
  Form,
  FormField,
  TextInput, Spinner
} from "grommet";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {PROFILE_TYPES} from "../../g_shared/types/profile";
import SignOutButton from "../../d_widgets/SignOutButton";
import SectionHeader from "../../e_features/SectionHeader";
import {useState} from "react";
import {useRoute} from "wouter";
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";
import Contacts from "../contacts/Contacts";
import {createBreed} from "../../g_shared/methods/api";
import {toast} from "react-toastify";

enum DATA_TYPES {
  PROFILE = 'PROFILE',
  CONTACTS = 'CONTACTS'
}

const ProfileScreen = () => {
  const [matchProfileRoute] = useRoute('/profile')
  const [activeDataType, setActiveDataType] = useState<DATA_TYPES>(matchProfileRoute ? DATA_TYPES.PROFILE : DATA_TYPES.CONTACTS)
  const {isSmall, columns, rows, areas} = useResponsiveGrid();

  const {email, name, type, connectedOrganisations: {
    canineFederation,
    nationalBreedClub,
    canineClub,
    kennel
  }} = useProfileDataStore();

  const [newBreedRuName, changeNewBreedRuName] = useState<string>('')
  const [newBreedEnName, changeNewBreedEnName] = useState<string>('')
  const [newBreedDescription, changeNewBreedDescription] = useState<string>('')
  const [isLoading, setIsLoading] = useState<null | boolean>(null)

  const handleSubmit = () => {
    if (email) {
      setIsLoading(true)
      createBreed({
        name: {
          rus: newBreedRuName,
          eng: newBreedEnName
        },
        breedDescription: newBreedDescription,
      }).then(() => {
        toast.info('Порода отправлена на модерацию')
      })
      .catch((e) => {
        console.error(e)
        toast.error('Ошибка при добавлении породы')
      })
      .finally(() => {
        setIsLoading(false)
      })
    }
  }

  return (
    <Grid
      rows={rows}
      columns={columns}
      areas={areas}
      height={'100%'}
    >
      {isSmall && (
        <SectionHeader
          activeDataType={activeDataType}
          buttons={[
            {type: DATA_TYPES.PROFILE, label: 'Профиль', link: '/profile'},
            {type: DATA_TYPES.CONTACTS, label: 'Контакты', link: '/contacts'},
          ]}
          isLink={true}
          setActiveDataType={setActiveDataType}
        />
      )}
      <Box gridArea={'content'} pad={{left: 'small', right: 'small'}} background={'lightBackground'}>
        {matchProfileRoute && (
          <Box overflow='auto'>
            <Card pad='medium' margin='small' background={'white'}>
              <CardBody>
                <Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>E-mail:</Text><Text>{email}</Text></Box>
                { type === PROFILE_TYPES.KENNEL ? (
                  <Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Название питомника:</Text><Text>{name}</Text></Box>
                ) : (
                  <Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Имя заводчика:</Text><Text>{name}</Text></Box>
                ) }
                { canineFederation && (<Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Кинологическая федерация:</Text><Text>{canineFederation}</Text></Box>) }
                { nationalBreedClub && (<Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Национальный клуб породы:</Text><Text>{nationalBreedClub}</Text></Box>) }
                { canineClub && (<Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Кинологический клуб:</Text><Text>{canineClub}</Text></Box>) }
                { kennel && (<Box direction='row'><Text weight='bold' margin={{right: 'xxsmall'}}>Питомник:</Text><Text>{kennel}</Text></Box>) }

              </CardBody>
              <CardFooter pad='medium' justify={"center"}>
                <SignOutButton fill={false}/>
              </CardFooter>
            </Card>
            <Card margin='small' pad='medium' gap='medium' overflow='visible' style={{minHeight: 'unset'}} background='white'>
              <Accordion>
              <AccordionPanel label={"Форма добавления новой породы"}>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <FormField
                        name='Название породы на русском'
                        htmlFor="breed-input-id"
                        label="Название породы на русском"
                        validate={() => {
                          if (!newBreedRuName) return 'Введите название породы на русском языке'
                        }}
                        validateOn={"blur"}
                    >
                      <TextInput
                          id="breed-input-id"
                          placeholder='Название породы'
                          value={newBreedRuName}
                          onChange={event => changeNewBreedRuName(event.target.value)}
                      />
                    </FormField>
                    <FormField
                        name='Название породы на английском'
                        htmlFor="breed-input-id"
                        label="Название породы на английском"
                        validate={() => {
                          if (!newBreedEnName) return 'Введите название породы на английском языке'
                        }}
                        validateOn={"blur"}
                    >
                      <TextInput
                          id="breed-input-id"
                          placeholder='Название породы'
                          value={newBreedEnName}
                          onChange={event => changeNewBreedEnName(event.target.value)}
                      />
                    </FormField>
                    <FormField
                        name='Cсылка на стандарт породы'
                        htmlFor="breed-description-input-id"
                        label="Cсылка на стандарт породы"
                        validate={() => {
                          if (!newBreedDescription) return 'Введите ссылку на стандарт породы'
                        }}
                        validateOn={"blur"}
                    >
                      <TextInput
                          id="epeat-password-input-id"
                          placeholder='Ссылка на стандарт породы в сети интернет'
                          value={newBreedDescription}
                          onChange={event => changeNewBreedDescription(event.target.value)}
                      />
                    </FormField>
                    <Button margin='small' type="submit" primary>
                      <Box direction={"row"} align={"center"} justify={"center"} gap={"medium"} height={"36px"}>
                        Сохранить новую породу
                        {isLoading && <Spinner color={'white'}/>}
                      </Box>
                    </Button>

                  </Form>
                </CardBody>

              </AccordionPanel>
            </Accordion>
            </Card>
          </Box>
        )}
        {!matchProfileRoute && (
          <Box overflow='auto'>
            <Contacts/>
          </Box>
        )}
      </Box>
    </Grid>
  );
}

export default ProfileScreen
