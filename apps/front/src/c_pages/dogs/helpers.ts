import {HistoryRecord} from "../../g_shared/types";
import {formatDateOrRange, sortDates} from "../../g_shared/methods/helpers";

export const getFieldsConfigFromHistoryRecords = (events: HistoryRecord[] | null, route = '/app/events/event') => {
  if (!events) return []
  events.sort(sortDates)
  return events.map(event => ({
    date: formatDateOrRange(event.date),
    key: event.id,
    value: event.title,
    link: true,
    linkValue: `${route}/${event.id}`
  }))
}

export const getFieldsConfigFromPuppiesList = (puppies: {id: string, fullName: string, verified: boolean}[]) => {
  return puppies.map(puppy => ({
    key: puppy.id,
    value: puppy.fullName,
    link: true,
    linkValue: `/app/dogs/dog/${puppy.id}`
  }))
}
