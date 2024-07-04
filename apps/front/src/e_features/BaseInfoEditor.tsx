import * as React from 'react'
import {
  Breed,
  IncomingDogData,
  IncomingEventData,
  IncomingLitterData, OutgoingHeatData, OutgoingTreatmentData,
  RawDogFields,
  RawLitterFields
} from "../g_shared/types";
import {GENDER} from "../g_shared/types/dog";
import {baseInfoFieldsConfig} from '../g_shared/constants/baseInfoEditorFieldsConfig'
import {
  Box,
  Button,
  CheckBox,
  DateInput,
  Form,
  FormField,
  Grid,
  RadioButtonGroup,
  Select,
  SelectMultiple, Spinner,
  TextArea,
  TextInput
} from "grommet";
import {useProfileDataStore} from "../f_entities/store/useProfileDataStore";
import {getRuTranslate} from "../g_shared/constants/translates";
import {EVENT_TYPE} from "../g_shared/types/event";
import {PERIODS} from "../c_pages/events/constants";

type Entity =
  | Pick<IncomingDogData, 'dateOfBirth' | 'gender' | 'breedId'>
  | Pick<IncomingDogData, 'fullName' | 'name'| 'dateOfDeath'| 'microchipNumber'| 'tattooNumber'| 'pedigreeNumber'| 'color'| 'isNeutered'| 'litterData'>
  | Pick<IncomingDogData, 'fullName' | 'name'| 'dateOfDeath'| 'color'| 'isNeutered'| 'litterData'>
  | IncomingDogData
  | Pick<IncomingDogData, RawDogFields | 'litterData'>
  | Pick<IncomingLitterData, RawLitterFields>
  | (IncomingEventData & {status: string}) // todo че за статус??
  | IncomingLitterData
  | Omit<OutgoingTreatmentData, 'profileId' | 'eventType' | 'activated'>
  | Omit<OutgoingHeatData, 'profileId' | 'eventType' | 'activated'>

type Props = {
  saveButtonLabel: string,
  entityType: keyof typeof BaseInfoFieldsByEntity,
  entity: Entity,
  handleInputChange: (key, value) => void,
  handleSubmit: () => void,
  handleSearch?: (searchString: string) => void,
  handleSearchByGender?: (searchString: string, gender: GENDER) => void,
  changeNewEventType?: (value: EVENT_TYPE) => void,
  changeFrequency?: (value: number) => void,
  switchRepeat?: () => void,
  litters?: {_id: string, litterTitle: string, dateOfBirth: string}[],
  newEventType?: EVENT_TYPE,
  repeat?: boolean,
  isFormDisabled?: boolean,
  isLoading?: boolean,
  frequencyInDays?: number,
  breeds?: Breed[],
  dogsList?: IncomingDogData[],
  maleDogsList?: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[],
  femaleDogsList?: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[],
  puppiesList?: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[],
}

const commonDogEventFields = ['date', 'dogId', 'status', 'comments']

const BaseInfoFieldsByEntity = {
  dog: ['name', 'fullName', 'dateOfBirth', 'dateOfDeath', 'breedId', 'gender', 'microchipNumber', 'tattooNumber', 'pedigreeNumber', 'color', 'isNeutered', 'litterData'],
  newDogValidation: ['dateOfBirth', 'breedId', 'gender'],
  newOwnDog: ['fullName', 'name', 'dateOfDeath', 'microchipNumber', 'tattooNumber', 'pedigreeNumber', 'color', 'isNeutered', 'litterData'],
  newOtherDog: ['fullName', 'name', 'dateOfDeath', 'color', 'isNeutered', 'litterData'],
  litter: ['fatherFullName', 'motherFullName', 'dateOfBirth', 'comments'],
  newLitter: ['fatherId', 'motherId', 'dateOfBirth', 'breedId', 'comments', 'puppyIds'],
  newAntiparasiticTreatment: ['eventType', 'dogId', 'date', 'comments', 'validity', 'medication', 'repeat'],
  newVaccination: ['eventType', 'dogId', 'date', 'comments', 'validity', 'medication', 'repeat'],
  newHeat: ['eventType', 'dogId', 'date', 'comments', 'repeat'],
  [EVENT_TYPE.HEAT]: [...commonDogEventFields],
  [EVENT_TYPE.ANTIPARASITIC_TREATMENT]: [...commonDogEventFields, 'medication', 'validity'],
  [EVENT_TYPE.VACCINATION]: [...commonDogEventFields, 'medication', 'validity'],
}

const isFutureEvent = (entity) => {
  return !entity.activated || (entity.status === 'overdue' || entity.status === 'planned')
}

const dogIdentificationValidator = (key, entity: Entity) => {
  switch (key) {
    case 'microchipNumber':
    case 'tattooNumber': {
      if ('microchipNumber' in entity && !entity.microchipNumber && 'tattooNumber' in entity && !entity.tattooNumber) return 'Должен быть заполнен номер чипа или номер клейма'
    }
  }
}

const BaseInfoEditor = (props: Props) => {
  const {getDogById} = useProfileDataStore();

  return (
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
                disabled={props.isFormDisabled}
                validate={() => dogIdentificationValidator(key, props.entity)}
                validateOn={"submit"}
              >
                <TextInput
                  disabled={props.isFormDisabled}
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
                disabled={props.isFormDisabled}
              >
                <TextArea
                  disabled={props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={props.entity[key]}
                  placeholder={fieldConfig.placeholder}
                  onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
                />
              </FormField>
            )
          }
          case 'disabledDogId': {
            return (
              <FormField
                key={fieldConfig.id}
                name={fieldConfig.label}
                htmlFor={fieldConfig.id}
                label={fieldConfig.label}
                disabled={props.isFormDisabled}
              >
                <TextInput
                  disabled
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={'dogId' in props.entity && (getDogById(props.entity.dogId).name || getDogById(props.entity.dogId).fullName)}
                  placeholder={fieldConfig.placeholder}
                  onChange={(event) => fieldConfig.handler(event, 'dogId', props.handleInputChange)}
                />
              </FormField>
            )
          }
          case 'dogId': {
            const femaleDogsList = props.dogsList.filter(dog => dog.gender === GENDER.FEMALE)
            const filteredDogsList = props.newEventType === EVENT_TYPE.HEAT ? femaleDogsList : props.dogsList
            return (
              <FormField
                key={fieldConfig.id}
                name={fieldConfig.label}
                htmlFor={fieldConfig.id}
                label={fieldConfig.label}
                disabled={props.isFormDisabled}
              >
                <Select
                  disabled={props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={fieldConfig.valueGetter(filteredDogsList, props.entity[key])}
                  options={filteredDogsList}
                  labelKey={fieldConfig.labelKey}
                  placeholder={fieldConfig.placeholder}
                  onSearch={(searchString) => props.handleSearch(searchString.trim().toLowerCase())}
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
                disabled={props.isFormDisabled}
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
                disabled={props.isFormDisabled}
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
                disabled={props.isFormDisabled}
              >
                <DateInput
                  disabled={props.entityType === 'litter' || props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={props.entity[key]}
                  format='dd.mm.yyyy'
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
                      disabled={props.isFormDisabled}
                    >
                      <DateInput
                        disabled={props.entityType === 'litter' || props.isFormDisabled}
                        id={fieldConfig.id}
                        name={fieldConfig.label}
                        value={props.entity[key]}
                        format='dd.mm.yyyy'
                        onChange={(event) => fieldConfig.handler(event, key, props.handleInputChange)}
                      />
                    </FormField>
                  )
                }
              </Box>
            )
          }
          case 'date': {
            const date = props.entity[key]
            return (
              <FormField
                key={fieldConfig.id}
                name={fieldConfig.label}
                htmlFor={fieldConfig.id}
                label={fieldConfig.label}
                disabled={props.isFormDisabled}
              >
                <DateInput
                  disabled={!isFutureEvent(props.entity) || props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={date.length === 2 ? date : date[0]}
                  format={props.entityType === EVENT_TYPE.HEAT ? 'dd.mm.yyyy-dd.mm.yyyy' : 'dd.mm.yyyy'}
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
                disabled={props.isFormDisabled}
              >
                <RadioButtonGroup
                  disabled={props.isFormDisabled}
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
                disabled={props.isFormDisabled}
              >
                <CheckBox
                  disabled={props.isFormDisabled}
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
                disabled={props.isFormDisabled}
              >
                <Select
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={props.breeds.find(breed => 'breedId' in props.entity && breed._id === props.entity.breedId)}
                  options={props.breeds}
                  disabled={hasPuppies || props.entityType === 'newLitter' || props.isFormDisabled}
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
                disabled={props.isFormDisabled}
              >
                <Select
                  disabled={props.isFormDisabled}
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
                disabled={props.isFormDisabled}
              >
                <Select
                  disabled={props.isFormDisabled}
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
                disabled={props.isFormDisabled}
              >
                <SelectMultiple
                  disabled={props.isFormDisabled}
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
          case 'eventType': {
            return (
              <FormField
                key={fieldConfig.id}
                name={fieldConfig.label}
                htmlFor={fieldConfig.id}
                label={fieldConfig.label}
                disabled={props.isFormDisabled}
              >
                <RadioButtonGroup
                  disabled={props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={props.newEventType}
                  options={fieldConfig.options}
                  onChange={({target}) => props.changeNewEventType(target.value as EVENT_TYPE)}
                />
              </FormField>
            )
          }
          case 'repeat': {
            return (
              <Box pad='small' key={fieldConfig.id}>
                <CheckBox
                  id={fieldConfig.id}
                  label={fieldConfig.label}
                  disabled={props.isFormDisabled}
                  checked={props.repeat}
                  onChange={props.switchRepeat}
                />
                {props.repeat && (
                  <FormField
                    htmlFor='frequency-input-id'
                    label='Следующее событие будет запланировано через'
                    disabled={props.isFormDisabled}
                  >
                    <Select
                      disabled={props.isFormDisabled}
                      id='frequency-input-id'
                      name={fieldConfig.label}
                      options={PERIODS}
                      labelKey={'label'}
                      value={PERIODS.find(per => per.value === props.frequencyInDays)}
                      onChange={(event) => props.changeFrequency(event.value.value)}
                    />
                  </FormField>
                )}
              </Box>
            )
          }
          default: {
            return (<Box>UNHANDLED INPUT</Box>)
          }
        }
      })}
      <Button margin='small' type="submit" primary>
        <Grid
          gap={"medium"}
          height={"36px"}
          rows={['1fr']}
          columns={['1fr', '200px', '1fr']}
          areas={[
            { name: 'filler', start: [0, 0], end: [0, 0]},
            { name: 'text', start: [1, 0], end: [1, 0] },
            { name: 'spinner', start: [2, 0], end: [2, 0] },
          ]}
        >
          <Box gridArea={'filler'}/>
          <Box gridArea={'text'} justify={"center"} alignContent={"center"}>
            {props.saveButtonLabel}
          </Box>
          <Box gridArea={'spinner'} justify={"center"}>
            {props.isLoading && <Spinner color={'white'}/>}
          </Box>
        </Grid>
      </Button>
    </Form>
  )
}

export default BaseInfoEditor
