import {EVENT_TYPE} from "../../../g_shared/types/event";

const CommonFields = ['date', 'dogId', 'status', 'comments']

export const eventDataFieldsByType = {
  [EVENT_TYPE.ANTIPARASITIC_TREATMENT]: [...CommonFields, 'medication', 'validity'],
  [EVENT_TYPE.HEAT]: [...CommonFields],
  [EVENT_TYPE.VACCINATION]: [...CommonFields, 'medication', 'validity'],
} as const;

export const fieldNamesMapping = {
  [EVENT_TYPE.ANTIPARASITIC_TREATMENT]: 'Информация об антипаразитарной обработке',
  [EVENT_TYPE.HEAT]: 'Информация о течке',
  [EVENT_TYPE.VACCINATION]: 'Информация о вакцинации',
} as const
