import {DateInput, RadioButtonGroup, TextInput, Select, CheckBox} from "grommet";
import {EVENT_TYPE} from '../../g_shared/types/event'
// todo убрать name из конфигов?

export const newDogEventFormConfig = {
  eventType: {
    component: RadioButtonGroup,
    label: 'Тип события',
    id: 'event-type-input-id',
    options: [{
      disabled: false,
      id: EVENT_TYPE.ANTIPARASITIC_TREATMENT,
      value: EVENT_TYPE.ANTIPARASITIC_TREATMENT,
      label: 'Антипаразитарная обработка'
    }, {
      disabled: false,
      id: EVENT_TYPE.HEAT,
      value: EVENT_TYPE.HEAT,
      label: 'Течка'
    }, {
      disabled: false,
      id: EVENT_TYPE.VACCINATION,
      value: EVENT_TYPE.VACCINATION,
      label: 'Вакцинация'
    }],
    handler: ({value}, key, method) => method(key, value),
  },
}

export const newEventFormConfig = {
  dogId: {
    component: Select,
    label: 'Кличка собаки',
    id: 'dog-id-input-id',
    placeholder: 'Полная кличка собаки',
    handler: (event, key, method) => method(key, event.value._id),
    valueGetter: (dogsList, id) => dogsList.find(dog => dog._id === id),
    labelKey: 'fullName',
  },
  date: {
    component: DateInput,
    label: 'Дата',
    id: 'date-input-id',
    handler: ({value}, key, method) => method(key, value),
  },
  comments: {
    component: TextInput,
    label: 'Комментарий',
    id: 'comments-input-id',
    placeholder: 'Поле для заметок',
    handler: (event, key, method) => method(key, event.target.value),
  },
  validity: {
    component: TextInput,
    label: 'Срок действия препарата в неделях',
    id: 'validity-input-id',
    placeholder: '4',
    type: 'number',
    handler: (event, key, method) => method(key, event.target.value),
  },
  medication: {
    component: TextInput,
    label: 'Название препарата',
    id: 'medication-input-id',
    placeholder: {
      [EVENT_TYPE.ANTIPARASITIC_TREATMENT]: 'Фронтлайн спрей',
      [EVENT_TYPE.VACCINATION]: 'Эурикан'
    },
    handler: (event, key, method) => method(key, event.target.value),
  },
  repeat: {
    component: CheckBox,
    label: 'Запланировать следующее событие',
    id: 'repeat-checkbox-id',
    toggle: true,
    handler: (event, key, method) => method(key, event.target.checked),
  }
}
