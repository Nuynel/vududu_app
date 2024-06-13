import * as React from 'react'
import {Breed, IncomingDogData, EventData, IncomingLitterData} from "../g_shared/types";
import {GENDER} from "../g_shared/types/dog";
import {baseInfoFieldsConfig} from '../g_shared/constants/baseInfoEditorFieldsConfig'
import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  Heading,
  TextInput,
  DateInput,
  RadioButtonGroup,
  CheckBox,
  Select,
  TextArea
} from "grommet";
import {CloseIcon} from '../g_shared/icons';
import {useProfileDataStore} from "../f_entities/store/useProfileDataStore";
import {getRuTranslate} from "../g_shared/constants/translates";


type Props = {
  title: string,
  entityType: keyof typeof BaseInfoFieldsByEntity,
  entity: IncomingDogData | (EventData & {status: string}) | IncomingLitterData,
  handleInputChange: (key, value) => void,
  handleSubmit: () => void,
  handleSearch?: (string) => void,
  litters?: {_id: string, litterTitle: string}[],
  breeds?: Breed[],
}

const commonDogEventFields = ['date', 'dogId', 'status', 'comments']

const BaseInfoFieldsByEntity = {
  dog: ['name', 'fullName', 'dateOfBirth', 'breedId', 'gender', 'microchipNumber', 'tattooNumber', 'pedigreeNumber', 'color', 'isNeutered', 'litterData'],
  litter: ['fatherFullName', 'motherFullName', 'dateOfBirth', 'comments'],
  heat: [...commonDogEventFields],
  treatment: [...commonDogEventFields, 'medication', 'validity'],
  vaccination: [...commonDogEventFields, 'medication', 'validity'],
}

const isFutureEvent = (entity) => {
  return !entity.activated || (entity.status === 'overdue' || entity.status === 'planned')
}

const BaseInfoEditor = ({title, entityType, entity, handleInputChange, handleSearch, handleSubmit, litters, breeds}: Props) => {
  const {getDogById} = useProfileDataStore();
  return (
    <Grid
      rows={['60px', 'auto']}
      columns={['60px', 'auto', '60px']}
      areas={[
        { name: 'header', start: [1, 0], end: [1, 0] },
        { name: 'exit', start: [2, 0], end: [2, 0] },
        { name: 'content', start: [0, 1], end: [2, 1] },
      ]}
      height={'100%'}
    >
      <Box gridArea='exit' height={'100%'} justify={"center"} align={'center'}>
        <Button
          focusIndicator={false}
          icon={<CloseIcon color='black'/>}
          fill={false}
          style={{width: '48px', borderRadius: '24px'}}
          secondary
          onClick={() => window.history.back()}
        />
      </Box>
      <Box
        gridArea='header'
        direction='row'
        alignSelf='center'
        justify='around'
        background={'white'}
        border={{color: '#F1F5F8', side: 'bottom', size: 'small', style: 'solid'}}
      >
        <Heading level={3}>
          {title}
        </Heading>
      </Box>
      <Box gridArea='content' overflow='scroll' background={'white'}>
        <Form
          onSubmit={handleSubmit}
          style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}
        >
          {BaseInfoFieldsByEntity[entityType].map((key) => {
            const fieldConfig = baseInfoFieldsConfig[key]

            switch (key) {
              case 'name':
              case 'fullName':
              case 'microchipNumber':
              case 'tattooNumber':
              case 'pedigreeNumber':
              case 'medication':
              case 'validity':
              case 'color': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <TextInput
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={entity[key]}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'comments': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <TextArea
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={entity[key]}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'dogId': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <TextInput
                      disabled
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={getDogById(entity[key]).name || getDogById(entity[key]).fullName}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'status': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <TextInput
                      disabled
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={getRuTranslate(entity[key])}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                    { ['heat', 'vaccination', 'treatment'].includes(entityType) && (entity[key] === 'overdue' || entity[key] === 'planned') && (
                      <Button
                        focusIndicator={false}
                        margin='small'
                        label={'Активировать'}
                        fill={false}
                        primary
                        onClick={() => handleInputChange('status', 'archived')}
                      />
                    )}
                  </FormField>
                )
              }
              case 'fatherFullName':
              case 'motherFullName': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <TextInput
                      disabled
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={entity[key]}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'dateOfBirth': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <DateInput
                      disabled={entityType === 'litter'}
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={entity[key]}
                      format='dd.mm.yyyy'
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'date': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <DateInput
                      disabled={!isFutureEvent(entity)}
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={entity[key]}
                      format={entityType === 'heat' ? 'dd/mm/yyyy-dd/mm/yyyy' : 'dd.mm.yyyy'}
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'gender': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <RadioButtonGroup
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={entity[key]}
                      options={[{
                        disabled: false,
                        id: GENDER.MALE,
                        value: GENDER.MALE,
                        label: 'Кобель'
                      }, {
                        disabled: false,
                        id: GENDER.FEMALE,
                        value: GENDER.FEMALE,
                        label: 'Сука'
                      }]}
                      // placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'isNeutered': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <CheckBox
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      checked={entity[key]}
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'breedId': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <Select
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={breeds.find(breed => 'breedId' in entity && breed._id === entity.breedId)}
                      options={breeds}
                      labelKey={(elem: Breed) => elem.name ? elem.name.rus : ''}
                      onSearch={(searchString) => fieldConfig.searchHandler(searchString, handleSearch)}
                      placeholder='Название породы'
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'litterData': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <Select
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={litters.find(litter => 'litterData' in entity && litter._id === entity.litterData?.id)}
                      options={litters}
                      labelKey='litterTitle'
                      placeholder='дд/мм/гггг, Отец/Мать'
                      onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                    />
                  </FormField>
                )
              }
              default: {
                return (<Box>UNHANDLED INPUT</Box>)
              }
            }
          })}
          <Button margin='small' type="submit" primary label="Сохранить" />
        </Form>
      </Box>
    </Grid>
  )
}

export default BaseInfoEditor
