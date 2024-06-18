import * as React from 'react'
import {
  Breed,
  IncomingDogData,
  EventData,
  IncomingLitterData,
  RawDogFields,
  RawLitterFields
} from "../g_shared/types";
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
  TextArea, SelectMultiple
} from "grommet";
import {CloseIcon} from '../g_shared/icons';
import {useProfileDataStore} from "../f_entities/store/useProfileDataStore";
import {getRuTranslate} from "../g_shared/constants/translates";


type Props = {
  title: string,
  entityType: keyof typeof BaseInfoFieldsByEntity,
  entity:
    | IncomingDogData
    | Pick<IncomingDogData, RawDogFields | 'litterData'>
    | Pick<IncomingLitterData, RawLitterFields>
    | (EventData & {status: string})
    | IncomingLitterData,
  handleInputChange: (key, value) => void,
  handleSubmit: () => void,
  handleSearch?: (searchString: string) => void,
  handleSearchByGender?: (searchString: string, gender: GENDER) => void,
  litters?: {_id: string, litterTitle: string}[],
  breeds?: Breed[],
  maleDogsList?: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[],
  femaleDogsList?: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[],
  puppiesList?: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[],
}

const commonDogEventFields = ['date', 'dogId', 'status', 'comments']

const BaseInfoFieldsByEntity = {
  dog: ['name', 'fullName', 'dateOfBirth', 'dateOfDeath', 'breedId', 'gender', 'microchipNumber', 'tattooNumber', 'pedigreeNumber', 'color', 'isNeutered', 'litterData'],
  litter: ['fatherFullName', 'motherFullName', 'dateOfBirth', 'comments'],
  newLitter: ['fatherId', 'motherId', 'dateOfBirth', 'breedId', 'comments', 'puppyIds'],
  heat: [...commonDogEventFields],
  treatment: [...commonDogEventFields, 'medication', 'validity'],
  vaccination: [...commonDogEventFields, 'medication', 'validity'],
}

const isFutureEvent = (entity) => {
  return !entity.activated || (entity.status === 'overdue' || entity.status === 'planned')
}

const BaseInfoEditor = (props: Props) => {
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
        <Heading level={3} margin={{vertical: "small"}}>
          {props.title}
        </Heading>
      </Box>
      <Box gridArea='content' overflow='scroll' background={'white'}>
        <Form
          onSubmit={props.handleSubmit}
          style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}
        >
          {BaseInfoFieldsByEntity[props.entityType].map((key) => {
            const fieldConfig = baseInfoFieldsConfig[key]
            const hasPuppies = 'reproductiveHistory' in props.entity && !!props.entity.reproductiveHistory.litters.length;

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
                      value={props.entity[key]}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
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
                      value={props.entity[key]}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
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
                      value={getDogById(props.entity[key]).name || getDogById(props.entity[key]).fullName}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
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
                      value={getRuTranslate(props.entity[key])}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
                    />
                    { ['heat', 'vaccination', 'treatment'].includes(props.entityType) && (props.entity[key] === 'overdue' || props.entity[key] === 'planned') && (
                      <Button
                        focusIndicator={false}
                        margin='small'
                        label={'Активировать'}
                        fill={false}
                        primary
                        onClick={() => props.handleInputChange('status', 'archived')}
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
                      value={props.entity[key]}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
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
                      disabled={props.entityType === 'litter'}
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={props.entity[key]}
                      format='дд.мм.гггг'
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'dateOfDeath': {
                return (
                  <Box key={fieldConfig.id}>
                    {props.entity[key] === null && (
                      <Button
                        margin='small'
                        secondary
                        label="Добавить дату гибели"
                        onClick={() => props.handleInputChange('dateOfDeath', (new Date()).toISOString())}
                      />
                    )}
                    {
                      props.entity[key] !== null && (
                        <FormField
                          name={fieldConfig.label}
                          htmlFor={fieldConfig.id}
                          label={fieldConfig.label}
                        >
                          <DateInput
                            disabled={props.entityType === 'litter'}
                            id={fieldConfig.id}
                            name={fieldConfig.label}
                            value={props.entity[key]}
                            format='дд.мм.гггг'
                            onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
                          />
                        </FormField>
                      )
                    }
                  </Box>
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
                      disabled={!isFutureEvent(props.entity)}
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={props.entity[key]}
                      format={props.entityType === 'heat' ? 'дд.мм.гггг-дд.мм.гггг' : 'дд.мм.гггг'}
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
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
                      value={props.entity[key]}
                      options={[{
                        disabled: hasPuppies,
                        id: GENDER.MALE,
                        value: GENDER.MALE,
                        label: 'Кобель'
                      }, {
                        disabled: hasPuppies,
                        id: GENDER.FEMALE,
                        value: GENDER.FEMALE,
                        label: 'Сука'
                      }]}
                      // placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
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
                      checked={props.entity[key]}
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
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
                      value={props.breeds.find(breed => 'breedId' in props.entity && breed._id === props.entity.breedId)}
                      options={props.breeds}
                      disabled={hasPuppies || props.entityType === 'newLitter'}
                      labelKey={(elem: Breed) => elem.name ? elem.name.rus : ''}
                      onSearch={(searchString) => fieldConfig.searchHandler(searchString, props.handleSearch)}
                      placeholder='Название породы'
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
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
                      value={props.litters.find(litter => 'litterData' in props.entity && litter._id === props.entity.litterData?.id)}
                      options={props.litters}
                      labelKey='litterTitle'
                      placeholder='дд.мм.гггг, Отец/Мать'
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'fatherId':
              case 'motherId': {
                const dogsList = key === 'fatherId' ? props.maleDogsList : props.femaleDogsList
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
                      value={fieldConfig.valueGetter(dogsList, props.entity[key])}
                      options={dogsList}
                      labelKey={fieldConfig.labelKey}
                      placeholder={fieldConfig.placeholder}
                      onSearch={(searchString) => fieldConfig.searchHandler(searchString, props.handleSearchByGender)}
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
                    />
                  </FormField>
                )
              }
              case 'puppyIds': {
                return (
                  <FormField
                    key={fieldConfig.id}
                    name={fieldConfig.label}
                    htmlFor={fieldConfig.id}
                    label={fieldConfig.label}
                  >
                    <SelectMultiple
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={props.entity[key].map(puppyId => props.puppiesList.find(puppy => puppy._id === puppyId))}
                      options={props.puppiesList}
                      labelKey={fieldConfig.labelKey}
                      placeholder={fieldConfig.placeholder}
                      onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
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
