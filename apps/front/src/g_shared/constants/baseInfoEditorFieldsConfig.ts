import {GENDER} from "../types/dog";
import {CheckBox, RadioButtonGroup} from "grommet";
import {EVENT_TYPE} from "../types/event";

export const baseInfoFieldsConfig = {
  name: {
    id: 'name-input-id',
    label: 'Домашняя кличка собаки',
    placeholder: 'Бобик',
    handler: (event, key, method) => method(key, event.target.value),
  },
  fullName: {
    id: 'fullName-input-id',
    label: 'Полная кличка собаки',
    placeholder: 'Наполеон Бонапарт из Старой Гвардии',
    handler: (event, key, method) => method(key, event.target.value),
  },
  dateOfBirth: {
    id: 'date-of-birth-input-id',
    label: 'Дата рождения',
    placeholder: '13/10/2021',
    format: 'dd/mm/yyyy',
    handler: ({value}, key, method) => method(key, value),
  },
  dateOfDeath: {
    id: 'date-of-death-input-id',
    label: 'Дата гибели',
    format: 'dd/mm/yyyy',
    handler: ({value}, key, method) => method(key, value),
  },
  date: {
    id: 'date-input-id',
    label: 'Дата',
    placeholder: new Date(),
    handler: ({value}, key, method) => method(key, value),
  },
  breedId: {
    id: 'breed-id-input-id',
    label: 'Порода',
    placeholder: 'Прайтер',
    handler: (event, key, method) => {
      console.log(event.option)
      method('breedId', event.option._id)
    },
    searchHandler: (searchString, method) => method(searchString),
  },
  gender: {
    id: 'gender-input-id',
    label: 'Пол',
    options: [{
      disabled: false,
      id: GENDER.MALE,
      value: GENDER.MALE,
      label: 'Кобель'
    }, {
      disabled: false,
      id: GENDER.FEMALE,
      value: GENDER.FEMALE,
      label: 'Сука'
    }],
    handler: ({target}, key, method) => method(key, target.value),
  },
  microchipNumber: {
    id: 'microchip-number-input-id',
    label: 'Номер микрочипа',
    placeholder: '12345-12345-12345',
    handler: (event, key, method) => method(key, event.target.value),
  },
  tattooNumber: {
    id: 'tattoo-number-input-id',
    label: 'Номер клейма или татуировки',
    placeholder: 'GPT12345',
    handler: (event, key, method) => method(key, event.target.value),
  },
  pedigreeNumber: {
    id: 'pedigree-number-input-id',
    label: 'Номер родословной',
    placeholder: 'GPT12345',
    handler: (event, key, method) => method(key, event.target.value),
  },
  color: {
    id: 'color-input-id',
    label: 'Окрас',
    placeholder: 'Голубой триколор',
    handler: (event, key, method) => method(key, event.target.value),
  },
  isNeutered: {
    id: 'is-neutered-input-id',
    label: 'Собака кастрирована?',
    handler: (event, key, method) => method(key, event.target.checked),
  },
  litterData: {
    id: 'litter-title-input-id',
    label: 'Помет',
    placeholder: 'дд/мм/гггг, Отец/Мать',
    handler: (event, key, method) => {
      method(key, {
        id: event.option._id,
        title: event.option.litterTitle,
      })
    },
  },
  fatherFullName: {
    id: 'fatherFullName-input-id',
    label: 'Кличка кобеля',
    placeholder: 'Наполеон Бонапарт из Старой Гвардии',
    handler: (event, key, method) => method(key, event.target.value),
  },
  motherFullName: {
    id: 'motherFullName-input-id',
    label: 'Кличка суки',
    placeholder: 'Джозефина из Старой Гвардии',
    handler: (event, key, method) => method(key, event.target.value),
  },
  comments: {
    id: 'comments-input-id',
    label: 'Комментарий',
    placeholder: 'Какие-либо заметки',
    handler: (event, key, method) => method(key, event.target.value),
  },
  disabledDogId: {
    id: 'dog-id-input-id',
    label: 'Собака',
    placeholder: 'Бобик',
    handler: (event, key, method) => method(key, event.target.value),
  },
  status: {
    id: 'status-input-id',
    label: 'Статус',
    placeholder: 'Запланировано',
    handler: (value, key, method) => method(key, value),
  },
  medication: {
    id: 'medication-input-id',
    label: 'Препарат',
    placeholder: 'Милпразон',
    handler: (value, key, method) => method(key, value.target.value),
  },
  validity: {
    id: 'validity-input-id',
    label: 'Продолжительность действия в неделях',
    placeholder: '12',
    handler: (value, key, method) => method(key, value.target.value),
  },
  fatherId: {
    id: 'father-id-input-id',
    label: 'Отец',
    placeholder: 'Полная кличка кобеля',
    labelKey: 'fullName',
    handler: (event, key, method) => method(key, event.option._id),
    searchHandler: (searchString, method) => method(searchString, GENDER.MALE),
    valueGetter: (dogsList, fatherId) => dogsList.find(stud => stud._id === fatherId),
  },
  motherId: {
    id: 'mother-id-input-id',
    label: 'Мать',
    placeholder: 'Полная кличка суки',
    labelKey: 'fullName',
    handler: (event, key, method) => method(key, event.option._id),
    searchHandler: (searchString, method) => method(searchString, GENDER.FEMALE),
    valueGetter: (dogsList, motherId) => dogsList.find(stud => stud._id === motherId),
  },
  dogId: {
    id: 'dog-id-input-id',
    label: 'Собака',
    placeholder: 'Полная кличка собаки',
    labelKey: 'fullName',
    handler: (event, key, method) => method(key, event.option._id),
    searchHandler: (searchString, method) => method(searchString),
    valueGetter: (dogsList, dogId) => dogsList.find(stud => stud._id === dogId),
  },
  puppyIds: {
    id: 'puppies-id-input-id',
    label: 'Щенки',
    placeholder: 'Выберите щенков',
    labelKey: 'fullName',
    handler: (event, key, method) => method(key, event.option._id),
  },
  eventType: {
    id: 'event-type-input-id',
    label: 'Тип события',
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
  repeat: {
    label: 'Запланировать следующее событие',
    id: 'repeat-checkbox-id',
    toggle: true,
    handler: (event, key, method) => method(key, event.target.checked),
  }
} as const;
