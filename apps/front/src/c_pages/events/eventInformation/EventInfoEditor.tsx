import {useEffect, useState} from "react";
import {IncomingEventData, OutgoingHeatData, OutgoingTreatmentData,} from "../../../g_shared/types";
import {useParams} from "wouter";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {updateHeatInfo, updateTreatmentInfo} from "../../../g_shared/methods/api";
import {EVENT_TYPE} from "../../../g_shared/types/event";
import {getDateDiff} from "../../../g_shared/methods/helpers";
import BaseInfoEditor from "../../../e_features/BaseInfoEditor";
import {getRuTranslate} from "../../../g_shared/constants/translates";
import FormPageWrapper from "../../../e_features/FormPageWrapper";


const getStatus = (dateDiff: number, isActivated: boolean) => {
  if (dateDiff < 0) return isActivated !== false ? 'archived' : 'overdue' // todo удалить проверку на false после перезаполнения бд
  return 'planned'
}
const EventInfoEditor = () => {
  const [event, changeEvent] = useState<IncomingEventData | null>(null);
  const [status, changeStatus] = useState<null | boolean>(null);

  const params: {id: string} = useParams();

  const {getEventById, setEventsData, eventsData, getDogById} = useProfileDataStore();

  const handleInputChange = (key, value) => {
    switch (key) {
      case 'status': {
        return changeStatus(true)
      }
      default: {
        changeEvent((prevState): IncomingEventData => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  useEffect(() => {
    const eventData = getEventById(params.id);
    if (eventData) {
      const eventCopy = JSON.parse(JSON.stringify(eventData));
      changeEvent(eventCopy);
      changeStatus(eventCopy.activated)
    } else {
      changeEvent(null);
    }
  }, [params])

  const handleSubmit = () => {
    switch (event.eventType) {
      case EVENT_TYPE.HEAT: {
        const newBaseEventInfo: Pick<OutgoingHeatData, 'comments' | 'date' | 'activated'> = {
          comments: event.comments,
          date: event.date,
          activated: status === null ? event.activated : status
        }
        return updateHeatInfo(newBaseEventInfo, event._id).then(
          () => {
            setEventsData(eventsData.map((eventData => eventData._id === event._id ? event : eventData)))
            window.history.back()
          })
      }
      case EVENT_TYPE.VACCINATION:
      case EVENT_TYPE.ANTIPARASITIC_TREATMENT: {
        const newBaseEventInfo: Pick<OutgoingTreatmentData, 'comments' | 'date' | 'activated' | 'validity' | 'medication'> = {
          comments: event.comments,
          date: event.date,
          activated: status === null ? event.activated : status,
          validity: 'validity' in event ? event.validity : 0,
          medication: 'medication' in event ? event.medication : '',
        }
        return updateTreatmentInfo(newBaseEventInfo, event._id).then(
          () => {
            setEventsData(eventsData.map((eventData => eventData._id === event._id ? {...event, activated: status === null ? event.activated : status} : eventData)))
            window.history.back()
          }
        )
      }
    }
  }

  if (!event) return null;

  // const dog = getDogById(event.dogId)

  const getTitle = (key) => getRuTranslate(key)

  return (
    <FormPageWrapper title={getTitle(event.eventType.toLowerCase())}>
      <BaseInfoEditor
        entityType={event.eventType}
        saveButtonLabel={'Сохранить'}
        entity={{...event, status: getStatus(getDateDiff(event.date[0]), status)}}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </FormPageWrapper>
  )
}

export default EventInfoEditor
