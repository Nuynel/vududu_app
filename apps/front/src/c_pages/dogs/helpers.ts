import {HistoryRecord} from "../../g_shared/types";
import {formatDateOrRange, sortDates} from "../../g_shared/methods/helpers";

export const getFieldsConfigFromHistoryRecords = (events: HistoryRecord[], route = '/events') => {
  events.sort(sortDates)
  return events.map(event => ({
    date: formatDateOrRange(event.date),
    key: event.id,
    value: event.title,
    link: true,
    linkValue: `${route}/${event.id}`
  }))
}

export const getFieldsConfigFromPuppiesList = (puppies: {id: string, name: string, fullName: string}[]) => {
  return puppies.map(puppy => ({
    key: puppy.id,
    value: puppy.fullName || puppy.name,
    link: true,
    linkValue: `/dogs/dog/${puppy.id}`
  }))
}
