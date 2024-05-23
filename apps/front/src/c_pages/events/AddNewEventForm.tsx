import {useState} from 'react'
import {Box, Button, Form, FormField, Heading} from "grommet";
import {
  Treatment,
  EventData,
  Heat,
  NewTreatmentFormFields,
  NewHeatFormFields,
} from "../../g_shared/types";
import {EVENT_TYPE} from "../../g_shared/types/event";
import {newEventFormConfig} from './formConfig'
import {createEvent} from "../../g_shared/methods/api";
import {useProfileDataStore} from "../../f_entities/store/useProfileDataStore";
import {GENDER} from "../../g_shared/types/dog";
import {fixTimezone} from "../../g_shared/methods/helpers";
import RepeatField from './uiComponents/RepeatField'
import EventTypeSelector from './uiComponents/EventTypeSelector'
import useResponsiveGrid from "../../f_entities/hooks/useResponsiveGrid";

// todo если в календаре дата (или последняя дата в случае диапазона) выбирается до сегодняшнего момента,
//  то предлагаем запланировать следующее событие
//  если событие - течка, то "запланировать следующее событие через Х месяцев?"
//  если событие - обработка, то "запланировать следующее событие через Х месяцев/недель?"

const initNewHeatData: Pick<Heat, NewHeatFormFields> = {
  dogId: '',
  date: [new Date((new Date()).valueOf() - (1000*60*60*24*2)).toISOString(), (new Date()).toISOString()],
  comments: '',
}

const initNewTreatmentData: Pick<Treatment, NewTreatmentFormFields> = {
  dogId: '',
  date: [(new Date()).toISOString()],
  validity: 0,
  medication: '',
  comments: '',
}

type RepeatInfo = {repeat: boolean, frequencyInDays: number}

const AddNewEventForm = ({hideCard}: {hideCard: () => void}) => {
  const {isSmall} = useResponsiveGrid()

  const [
    newEventType,
    changeNewEventType,
  ] = useState<EVENT_TYPE>(EVENT_TYPE.ANTIPARASITIC_TREATMENT)
  const [
    repeat,
    switchRepeat
  ] = useState<boolean>(false)
  const [
    frequencyInDays,
    changeFrequency
  ] = useState<number>(4)
  const [
    newHeatData,
    changeNewHeatData,
  ] = useState<Pick<Heat, NewHeatFormFields>>({...initNewHeatData})
  const [
    newTreatmentData,
    changeNewTreatmentData,
  ] = useState<Pick<Treatment, NewTreatmentFormFields>>({...initNewTreatmentData})
  const [
    newVaccinationData,
    changeNewVaccinationData,
  ] = useState<Pick<Treatment, NewTreatmentFormFields>>({...initNewTreatmentData})

  const getInitData = () => {
    switch (newEventType) {
      case EVENT_TYPE.ANTIPARASITIC_TREATMENT:
      case EVENT_TYPE.VACCINATION:
        return initNewTreatmentData
      case EVENT_TYPE.HEAT:
        return initNewHeatData
    }
  }

  const getValue = () => {
    switch (newEventType) {
      case EVENT_TYPE.ANTIPARASITIC_TREATMENT:
        return newTreatmentData
      case EVENT_TYPE.VACCINATION:
        return newVaccinationData
      case EVENT_TYPE.HEAT:
        return newHeatData
    }
  }

  const {dogsData, setEventsData, eventsData} = useProfileDataStore();

  const [dogsList, changeDogsList] = useState(dogsData)

  const handleInputChange = (key, value) => {
    switch (key) {
      case 'eventType': {
        changeNewEventType(value)
        break;
      }
      case 'date': {
        switch (newEventType) {
          case EVENT_TYPE.VACCINATION:
            const dateWithTimeZone = fixTimezone(value)
            return changeNewVaccinationData(
              (prevState): Pick<Treatment, NewTreatmentFormFields> => (
                {...prevState, [key]: [dateWithTimeZone]}
              ))
          case EVENT_TYPE.ANTIPARASITIC_TREATMENT: {
            const dateWithTimeZone = fixTimezone(value)
            return changeNewTreatmentData(
              (prevState): Pick<Treatment, NewTreatmentFormFields> => (
                {...prevState, [key]: [dateWithTimeZone]}
              ))
          }
          case EVENT_TYPE.HEAT: {
            const dateWithTimeZone = value.map(date => fixTimezone(date))
            return changeNewHeatData(
              (prevState): Pick<Heat, NewHeatFormFields> => (
                {...prevState, [key]: dateWithTimeZone}
              ))
          }
        }
        break;
      }
      default: {
        switch (newEventType) {
          case EVENT_TYPE.VACCINATION:
            return changeNewVaccinationData(
              (prevState): Pick<Treatment, NewTreatmentFormFields> => (
                {...prevState, [key]: value}
              ))
          case EVENT_TYPE.ANTIPARASITIC_TREATMENT:
            return changeNewTreatmentData(
              (prevState): Pick<Treatment, NewTreatmentFormFields> => (
                {...prevState, [key]: value}
              ))
          case EVENT_TYPE.HEAT:
            return changeNewHeatData(
              (prevState): Pick<Heat, NewHeatFormFields> => (
                {...prevState, [key]: value}
              ))
        }
      }
    }
  }

  const constructNewEvent = () => {
    switch (newEventType) {
      case EVENT_TYPE.VACCINATION: {
        const newVaccination: Omit<Treatment, 'profileId' | '_id' | 'activated'> & RepeatInfo = {
          ...newVaccinationData,
          repeat,
          frequencyInDays,
          eventType: newEventType,
        }
        return newVaccination
      }
      case EVENT_TYPE.ANTIPARASITIC_TREATMENT: {
        const newTreatment: Omit<Treatment, 'profileId' | '_id' | 'activated'> & RepeatInfo = {
          ...newTreatmentData,
          repeat,
          frequencyInDays,
          eventType: newEventType,
        }
        return newTreatment
      }
      case EVENT_TYPE.HEAT: {
        const newHeat: Omit<Heat, 'profileId' | '_id' | 'activated'> & RepeatInfo = {
          ...newHeatData,
          eventType: newEventType,
          repeat,
          frequencyInDays,
          connectedEvents: {
            mate: null,
          }
        }
        return newHeat
      }
    }
  }

  const handleSubmit = () => {
    const newEvent = constructNewEvent()
    createEvent(newEvent).then(
      ({newEvents}: {newEvents: EventData[]}) => {
        setEventsData([...eventsData, ...newEvents])
        hideCard()
      }).catch((e) =>{
      console.error(e)
    })
  }

  const handleSearch = (searchString: string) => {
    changeDogsList(() => dogsData.filter(dogData => (
      dogData.name.toLowerCase().includes(searchString) || dogData.fullName.toLowerCase().includes(searchString)
    )))
  }

  return (
    <Box pad={"medium"} width={isSmall ? 'auto' : 'large'}>
      <Heading level={2} margin={"medium"}>Добавить событие</Heading>
      <Form
        onSubmit={handleSubmit}
        style={{display: "flex", justifyContent: 'center', flexDirection: 'column'}}
      >
        <EventTypeSelector newEventType={newEventType} changeNewEventType={changeNewEventType}/>
        {Object.keys(getInitData()).map((key) => {
          const fieldConfig = newEventFormConfig[key]
          const Field = fieldConfig.component
          const newEventData = newEventType === EVENT_TYPE.HEAT ? newHeatData : newTreatmentData
          const dateFormat = newEventType === EVENT_TYPE.HEAT ? 'dd/mm/yyyy-dd/mm/yyyy' : 'dd/mm/yyyy';
          switch (key) {
            case 'dogId': {
              const femaleDogsList = dogsList.filter(dog => dog.gender === GENDER.FEMALE)
              const filteredDogsList = newEventType === EVENT_TYPE.HEAT ? femaleDogsList : dogsList
              return (
                <FormField key={fieldConfig.id} name={fieldConfig.label} htmlFor={fieldConfig.id} label={fieldConfig.label}>
                  <Field
                    id={fieldConfig.id}
                    name={fieldConfig.label}
                    value={fieldConfig.valueGetter(filteredDogsList, newEventData[key])}
                    options={filteredDogsList}
                    labelKey={fieldConfig.labelKey}
                    format={fieldConfig.format}
                    placeholder={fieldConfig.placeholder}
                    onSearch={(searchString) => handleSearch(searchString.trim().toLowerCase())}
                    onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                  />
                </FormField>
              )
            }
            case 'date': {
              const date = getValue()[key]
              return (
                <FormField key={fieldConfig.id} name={fieldConfig.label} htmlFor={fieldConfig.id} label={fieldConfig.label}>
                  <Field
                    id={fieldConfig.id}
                    name={fieldConfig.label}
                    value={date.length === 2 ? date : date[0]}
                    format={dateFormat}
                    options={fieldConfig.options}
                    placeholder={fieldConfig.placeholder}
                    onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                  />
                </FormField>
              )
            }
            case 'comments':
            case 'validity':
              return (
                <FormField key={fieldConfig.id} name={fieldConfig.label} htmlFor={fieldConfig.id} label={fieldConfig.label}>
                  <Field
                    id={fieldConfig.id}
                    name={fieldConfig.label}
                    value={getValue()[key]}
                    format={dateFormat}
                    options={fieldConfig.options}
                    placeholder={fieldConfig.placeholder}
                    onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                  />
                </FormField>
              )
            case 'medication':
              return (
                <FormField key={fieldConfig.id} name={fieldConfig.label} htmlFor={fieldConfig.id} label={fieldConfig.label}>
                  <Field
                    id={fieldConfig.id}
                    name={fieldConfig.label}
                    value={getValue()[key]}
                    format={dateFormat}
                    options={fieldConfig.options}
                    placeholder={fieldConfig.placeholder[newEventType]}
                    onChange={(event) => fieldConfig.handler(event, key, handleInputChange)}
                  />
                </FormField>
              )
          }
        })}
        <RepeatField
          repeat={repeat}
          switchRepeat={() => switchRepeat(!repeat)}
          frequencyInDays={frequencyInDays}
          changeFrequency={changeFrequency}
        />
        <Button margin='small' type="submit" primary label="Сохранить" />
      </Form>
    </Box>
  )
}

export default AddNewEventForm
