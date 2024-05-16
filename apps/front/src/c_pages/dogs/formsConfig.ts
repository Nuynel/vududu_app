import {DateInput, RadioButtonGroup, TextInput, CheckBox, Select} from "grommet";
import {GENDER} from "../../g_shared/types/dog";

export const newDogFormConfig = {
  name: {
    component: TextInput,
    id: 'name-input-id',
    label: 'Домашняя кличка собаки',
    placeholder: 'Бобик',
    handler: (event, key, method) => method(key, event.target.value),
  },
  fullName: {
    component: TextInput,
    id: 'fullName-input-id',
    label: 'Полная кличка собаки',
    placeholder: 'Наполеон Бонапарт из Старой Гвардии',
    handler: (event, key, method) => method(key, event.target.value),
  },
  dateOfBirth: {
    component: DateInput,
    id: 'date-of-birth-input-id',
    label: 'Дата рождения',
    placeholder: '13/10/2021',
    format: 'dd/mm/yyyy',
    handler: ({value}, key, method) => method(key, value),
  },
  breed: {
    component: TextInput,
    id: 'breed-input-id',
    label: 'Порода',
    placeholder: 'Прайтер',
    handler: (event, key, method) => method(key, event.target.value),
  },
  gender: {
    component: RadioButtonGroup,
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
    component: TextInput,
    id: 'microchip-number-input-id',
    label: 'Номер микрочипа',
    placeholder: '12345-12345-12345',
    handler: (event, key, method) => method(key, event.target.value),
  },
  tattooNumber: {
    component: TextInput,
    id: 'tattoo-number-input-id',
    label: 'Номер клейма или татуировки',
    placeholder: 'GPT12345',
    handler: (event, key, method) => method(key, event.target.value),
  },
  pedigreeNumber: {
    component: TextInput,
    id: 'pedigree-number-input-id',
    label: 'Номер родословной',
    placeholder: 'GPT-12345',
    handler: (event, key, method) => method(key, event.target.value),
  },
  color: {
    component: TextInput,
    id: 'color-input-id',
    label: 'Окрас',
    placeholder: 'Голубой триколор',
    handler: (event, key, method) => method(key, event.target.value),
  },
  isNeutered: {
    component: CheckBox,
    id: 'is-neutered-input-id',
    label: 'Собака кастрирована?',
    handler: (event, key, method) => method(key, event.target.checked),
  }
} as const;

export const newLitterFormConfig = {
  dateOfBirth: {
    component: DateInput,
    id: 'date-of-birth-input-id',
    label: 'Дата рождения',
    placeholder: '13/10/2021',
    format: 'dd/mm/yyyy',
    handler: ({value}, key, method) => method(key, value),
  },
  comments: {
    component: TextInput,
    id: 'comments-input-id',
    label: 'Комментарий',
    placeholder: 'Какие-либо заметки о помете',
    handler: (event, key, method) => method(key, event.target.value),
  },
  fatherId: {
    component: Select,
    label: 'Отец',
    id: 'father-id-input-id',
    placeholder: 'Полная кличка кобеля',
    handler: (event, key, method) => method(key, event.option._id),
    searchHandler: (searchString, method) => method(searchString, GENDER.MALE),
    valueGetter: (dogsList, fatherId) => {dogsList.find(stud => stud._id === fatherId)},
    labelKey: 'fullName',
  },
  motherId: {
    component: Select,
    label: 'Мать',
    id: 'mother-id-input-id',
    placeholder: 'Полная кличка суки',
    handler: (event, key, method) => method(key, event.option._id),
    searchHandler: (searchString, method) => method(searchString, GENDER.FEMALE),
    valueGetter: (dogsList, motherId) => {dogsList.find(stud => stud._id === motherId)},
    labelKey: 'fullName',
  }
} as const;
