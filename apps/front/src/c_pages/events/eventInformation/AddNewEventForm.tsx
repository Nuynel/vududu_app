import {
  IncomingEventData,
  OutgoingTreatmentData,
  OutgoingHeatData
} from "../../../g_shared/types";
import {useEffect, useState} from "react";
import {EVENT_TYPE} from "../../../g_shared/types/event";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {fixTimezone} from "../../../g_shared/methods/helpers";
import {createEvent} from "../../../g_shared/methods/api";
import BaseInfoEditor from "../../../e_features/BaseInfoEditor";
import useGetInitialData from "../../../f_entities/hooks/useGetInitialData";
import FormPageWrapper from "../../../e_features/FormPageWrapper";

const initNewHeatData: Omit<OutgoingHeatData, 'profileId' | 'activated' | 'eventType'> = {
  dogId: '',
  date: [new Date((new Date()).valueOf() - (1000*60*60*24*2)).toISOString(), (new Date()).toISOString()],
  comments: '',
}

const initNewTreatmentData: Omit<OutgoingTreatmentData, 'profileId' | 'activated' | 'eventType'> = {
  dogId: '',
  date: [(new Date()).toISOString()],
  validity: 0,
  medication: '',
  comments: '',
}

type RepeatInfo = {repeat: boolean, frequencyInDays: number}

const AddNewEventForm = () => {
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
  ] = useState<Omit<OutgoingHeatData, 'profileId' | 'activated' | 'eventType'>>({...initNewHeatData})
  const [
    newTreatmentData,
    changeNewTreatmentData,
  ] = useState<Omit<OutgoingTreatmentData, 'profileId' | 'activated' | 'eventType'>>({...initNewTreatmentData})
  const [
    newVaccinationData,
    changeNewVaccinationData,
  ] = useState<Omit<OutgoingTreatmentData, 'profileId' | 'activated' | 'eventType'>>({...initNewTreatmentData})

  const {dogsData, setEventsData, eventsData} = useProfileDataStore();
  const {getInitialData} = useGetInitialData()

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
              (prevState): Omit<OutgoingTreatmentData, 'profileId' | 'activated' | 'eventType'> => (
                {...prevState, [key]: [dateWithTimeZone]}
              ))
          case EVENT_TYPE.ANTIPARASITIC_TREATMENT: {
            const dateWithTimeZone = fixTimezone(value)
            return changeNewTreatmentData(
              (prevState): Omit<OutgoingTreatmentData, 'profileId' | 'activated' | 'eventType'> => (
                {...prevState, [key]: [dateWithTimeZone]}
              ))
          }
          case EVENT_TYPE.HEAT: {
            const dateWithTimeZone = value.map(date => fixTimezone(date))
            return changeNewHeatData(
              (prevState): Omit<OutgoingHeatData, 'profileId' | 'activated' | 'eventType'> => (
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
              (prevState): Omit<OutgoingTreatmentData, 'profileId' | 'activated' | 'eventType'> => (
                {...prevState, [key]: value}
              ))
          case EVENT_TYPE.ANTIPARASITIC_TREATMENT:
            return changeNewTreatmentData(
              (prevState): Omit<OutgoingTreatmentData, 'profileId' | 'activated' | 'eventType'> => (
                {...prevState, [key]: value}
              ))
          case EVENT_TYPE.HEAT:
            return changeNewHeatData(
              (prevState): Omit<OutgoingHeatData, 'profileId' | 'activated' | 'eventType'> => (
                {...prevState, [key]: value}
              ))
        }
      }
    }
  }

  const constructNewEvent = () => {
    switch (newEventType) {
      case EVENT_TYPE.VACCINATION: {
        const newVaccination: Omit<OutgoingTreatmentData, 'profileId' | '_id' | 'activated'> & RepeatInfo = {
          ...newVaccinationData,
          repeat,
          frequencyInDays,
          eventType: newEventType,
        }
        return newVaccination
      }
      case EVENT_TYPE.ANTIPARASITIC_TREATMENT: {
        const newTreatment: Omit<OutgoingTreatmentData, 'profileId' | '_id' | 'activated'> & RepeatInfo = {
          ...newTreatmentData,
          repeat,
          frequencyInDays,
          eventType: newEventType,
        }
        return newTreatment
      }
      case EVENT_TYPE.HEAT: {
        const newHeat: Omit<OutgoingHeatData, 'profileId' | '_id' | 'activated'> & RepeatInfo = {
          ...newHeatData,
          repeat,
          frequencyInDays,
          eventType: newEventType,
        }
        return newHeat
      }
    }
  }

  const handleSubmit = () => {
    const newEvent = constructNewEvent()
    createEvent(newEvent)
      .then(async ({newEvents}: {newEvents: IncomingEventData[]}) => {
        setEventsData([...eventsData, ...newEvents])
        return await getInitialData() // todo не перезапрашивать, а просто пушить локально
      })
      .then(() => window.history.back())
      .catch((e) => console.error(e))
  }

  const handleSearch = (searchString: string) => {
    changeDogsList(() => dogsData.filter(dogData => (
      dogData.name.toLowerCase().includes(searchString) || dogData.fullName.toLowerCase().includes(searchString)
    )))
  }

  useEffect(() => {
    changeDogsList(dogsData)
  }, [dogsData])

  const getValue = ():
    | Omit<OutgoingTreatmentData, 'profileId' | 'activated' | 'eventType'>
    | Omit<OutgoingHeatData, 'profileId' | 'activated' | 'eventType'> => {
    switch (newEventType) {
      case EVENT_TYPE.ANTIPARASITIC_TREATMENT: return newTreatmentData
      case EVENT_TYPE.VACCINATION: return newVaccinationData
      case EVENT_TYPE.HEAT: return newHeatData
    }
  }

  const getEntityType = () => {
    switch (newEventType) {
      case EVENT_TYPE.VACCINATION: return 'newVaccination'
      case EVENT_TYPE.ANTIPARASITIC_TREATMENT: return 'newAntiparasiticTreatment'
      case EVENT_TYPE.HEAT: return 'newHeat'
    }
  }

  return (
    <FormPageWrapper title={'Добавление события'}>
      <BaseInfoEditor
        entityType={getEntityType()}
        entity={getValue()}
        newEventType={newEventType}
        repeat={repeat}
        frequencyInDays={frequencyInDays}
        dogsList={dogsList}
        saveButtonLabel={'Сохранить'}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        changeNewEventType={changeNewEventType}
        changeFrequency={changeFrequency}
        handleSearch={handleSearch}
        switchRepeat={() => switchRepeat(!repeat)}
      />
    </FormPageWrapper>
  )
}

export default AddNewEventForm
