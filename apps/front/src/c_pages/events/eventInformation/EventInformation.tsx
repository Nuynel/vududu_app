import {useEffect, useState} from "react";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {BlocksConfig, IncomingEventData, FieldData} from "../../../g_shared/types";
import {eventDataFieldsByType, fieldNamesMapping} from "./configurations";
import * as React from "react";
import {formatDateOrRange, getDateDiff} from "../../../g_shared/methods/helpers";
import {BLOCK_TYPES} from "../../../g_shared/types/components";
import {useLocation, useParams} from "wouter";
import EntityPage from "../../../e_features/EntityPage";
import {getRuTranslate} from "../../../g_shared/constants/translates";
import {Paths} from "../../../g_shared/constants/routes";

const EventInformation = () => {
  const [event, setEvent] = useState<IncomingEventData | null>(null)
  const [, setLocation] = useLocation();

  const params: {id: string} = useParams();

  const {getEventById, getDogById} = useProfileDataStore();

  useEffect(() => {
    setEvent(getEventById(params.id))
  }, [params])

  if (!event) return null;

  const closeEventPage = () => {
    setLocation(Paths.events);
  }

  const getDogName = () => {
    if (getDogById(event.dogId)) return getDogById(event.dogId).name || getDogById(event.dogId).fullName
    return '-'
  }

  const getStatus = (dateDiff: number, isActivated: boolean) => {
    if (dateDiff < 0) return isActivated !== false ? 'archived' : 'overdue'
    return 'planned'
  }

  const getCardsConfig = (): BlocksConfig => {
    const commonFields: FieldData[] = eventDataFieldsByType[event.eventType].map(fieldName => {
      switch (fieldName) {
        case 'date': return {
          key: fieldName,
          value: formatDateOrRange(event.date),
          link: false,
        }
        case 'dogId': return {
          key: fieldName,
          value: getDogName(),
          link: true,
          linkValue: `/dogs/dog/${event.dogId}`,
        }
        case 'status': return {
          key: fieldName,
          value: getRuTranslate(getStatus(getDateDiff(event.date[0]), event.activated)),
          link: false,
        }
        default: return {
          key: fieldName,
          value: event[fieldName] || '-',
          link: false,
        }
      }
    })

    return {
      title: fieldNamesMapping[event.eventType],
      commonData: {
        blockName: 'commonData',
        blockType: BLOCK_TYPES.COMMON,
        blockFields: commonFields,
      },
      additionalData: []
    }
  }

  return (
    <EntityPage
      config={getCardsConfig()}
      openBaseInfoEditor={() => setLocation(`/events/${event._id}/editor`)}
      closeEntityPage={closeEventPage}
    />
  )
}

export default EventInformation
