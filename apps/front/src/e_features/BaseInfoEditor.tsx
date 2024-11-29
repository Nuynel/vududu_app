import * as React from 'react'
import {
  Breed,
  IncomingDogData,
  IncomingEventData,
  IncomingLitterData, OutgoingHeatData, OutgoingTreatmentData,
  RawDogFields,
  RawLitterFields
} from "../g_shared/types";
import {GENDER} from "../g_shared/types/dog";
import {baseInfoFieldsConfig} from '../g_shared/constants/baseInfoEditorFieldsConfig'
import {useProfileDataStore} from "../f_entities/store/useProfileDataStore";
import {getRuTranslate} from "../g_shared/constants/translates";
import {CustomSpinner} from "../g_shared/ui_components";
import {EVENT_TYPE} from "../g_shared/types/event";
import {PERIODS} from "../c_pages/events/constants";
import {formatSingleDate} from "../g_shared/methods/helpers";

type Entity =
  | Pick<IncomingDogData, 'dateOfBirth' | 'gender' | 'breedId'>
  | Pick<IncomingDogData, 'fullName' | 'name'| 'dateOfDeath'| 'microchipNumber'| 'tattooNumber'| 'pedigreeNumber'| 'color'| 'isNeutered'| 'litterData'>
  | Pick<IncomingDogData, 'fullName' | 'name'| 'dateOfDeath'| 'color'| 'isNeutered'| 'litterData'>
  | IncomingDogData
  | Pick<IncomingDogData, RawDogFields | 'litterData'>
  | Pick<IncomingLitterData, RawLitterFields>
  | (IncomingEventData & {status: string}) // todo че за статус??
  | IncomingLitterData
  | Omit<OutgoingTreatmentData, 'profileId' | 'eventType' | 'activated'>
  | Omit<OutgoingHeatData, 'profileId' | 'eventType' | 'activated'>

type Props = {
  saveButtonLabel: string,
  entityType: keyof typeof BaseInfoFieldsByEntity,
  entity: Entity,
  handleInputChange: (key, value) => void,
  handleSubmit: () => void,
  handleSearch?: (searchString: string) => void,
  handleSearchByGender?: (searchString: string, gender: GENDER) => void,
  changeNewEventType?: (value: EVENT_TYPE) => void,
  changeFrequency?: (value: number) => void,
  switchRepeat?: () => void,
  litters?: {_id: string, litterTitle: string, dateOfBirth: string}[],
  newEventType?: EVENT_TYPE,
  repeat?: boolean,
  isFormDisabled?: boolean,
  isLoading?: boolean,
  frequencyInDays?: number,
  breeds?: Breed[],
  dogsList?: IncomingDogData[],
  maleDogsList?: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[],
  femaleDogsList?: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[],
  puppiesList?: Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[],
}

const commonDogEventFields = ['date', 'dogId', 'status', 'comments']

const BaseInfoFieldsByEntity = {
  dog: ['name', 'fullName', 'dateOfBirth', 'dateOfDeath', 'breedId', 'gender', 'microchipNumber', 'tattooNumber', 'pedigreeNumber', 'color', 'isNeutered', 'litterData'],
  newDogValidation: ['dateOfBirth', 'breedId', 'gender'],
  newOwnDog: ['fullName', 'name', 'dateOfDeath', 'microchipNumber', 'tattooNumber', 'pedigreeNumber', 'color', 'isNeutered', 'litterData'],
  newOtherDog: ['fullName', 'name', 'dateOfDeath', 'color', 'isNeutered', 'litterData'],
  litter: ['fatherFullName', 'motherFullName', 'dateOfBirth', 'comments'],
  newLitter: ['fatherData', 'motherData', 'dateOfBirth', 'breedId', 'comments', 'puppyIds'],
  newAntiparasiticTreatment: ['eventType', 'dogId', 'date', 'comments', 'validity', 'medication', 'repeat'],
  newVaccination: ['eventType', 'dogId', 'date', 'comments', 'validity', 'medication', 'repeat'],
  newHeat: ['eventType', 'dogId', 'date', 'comments', 'repeat'],
  [EVENT_TYPE.HEAT]: [...commonDogEventFields],
  [EVENT_TYPE.ANTIPARASITIC_TREATMENT]: [...commonDogEventFields, 'medication', 'validity'],
  [EVENT_TYPE.VACCINATION]: [...commonDogEventFields, 'medication', 'validity'],
}

const isFutureEvent = (entity) => {
  return !entity.activated || (entity.status === 'overdue' || entity.status === 'planned')
}

const dogIdentificationValidator = (key, entity: Entity) => {
  switch (key) {
    case 'microchipNumber':
    case 'tattooNumber': {
      if ('microchipNumber' in entity && !entity.microchipNumber && 'tattooNumber' in entity && !entity.tattooNumber) return 'Должен быть заполнен номер чипа или номер клейма'
    }
  }
}

const BaseInfoEditor = (props: Props) => {
  const {getDogById} = useProfileDataStore();

  return (
    <form
      onSubmit={props.handleSubmit}
      className="flex flex-col justify-center"
    >
      {BaseInfoFieldsByEntity[props.entityType].map((key) => {
        const fieldConfig = baseInfoFieldsConfig[key]
        const hasPuppies = 'reproductiveHistory' in props.entity && !!props.entity.reproductiveHistory.litters.length;

        switch (key) {
          case 'name':
          case 'fullName':
          case 'microchipNumber':
          case 'tattooNumber':
          case 'pedigreeNumber':
          case 'medication':
          case 'validity':
          case 'color': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <input
                  type="text"
                  disabled={props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={props.entity[key]}
                  placeholder={fieldConfig.placeholder}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {dogIdentificationValidator(key, props.entity) && (
                  <p className="mt-2 text-red-600 text-sm">
                    {dogIdentificationValidator(key, props.entity)}
                  </p>
                )}
              </div>
            )
          }
          case 'comments': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <textarea
                  disabled={props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={props.entity[key]}
                  placeholder={fieldConfig.placeholder}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )
          }
          case 'disabledDogId': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <input
                  type="text"
                  disabled
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={
                    'dogId' in props.entity &&
                    (getDogById(props.entity.dogId)?.name || getDogById(props.entity.dogId)?.fullName)
                  }
                  placeholder={fieldConfig.placeholder}
                  onChange={(e) => fieldConfig.handler(e, 'dogId', props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )
          }
          case 'dogId': {
            const femaleDogsList = props.dogsList.filter(dog => dog.gender === GENDER.FEMALE)
            const filteredDogsList = props.newEventType === EVENT_TYPE.HEAT ? femaleDogsList : props.dogsList
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <select
                  disabled={props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={fieldConfig.valueGetter(filteredDogsList, props.entity[key])?._id}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {filteredDogsList.map((dog) => (
                    <option key={dog._id} value={dog._id}>
                      {dog[fieldConfig.labelKey]}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          case 'status': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <input
                  type="text"
                  disabled
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={getRuTranslate(props.entity[key])}
                  placeholder={fieldConfig.placeholder}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {['heat', 'vaccination', 'treatment'].includes(props.entityType) && (props.entity[key] === 'overdue' || props.entity[key] === 'planned') && (
                  <button
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm"
                    onClick={() => props.handleInputChange('status', 'archived')}
                  >
                    Активировать
                  </button>
                )}
              </div>
            )
          }
          case 'fatherFullName':
          case 'motherFullName': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <input
                  type="text"
                  disabled
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={props.entity[key]}
                  placeholder={fieldConfig.placeholder}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )
          }
          case 'dateOfBirth': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <input
                  type="date"
                  disabled={props.entityType === 'litter' || props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={formatSingleDate(props.entity[key])}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )
          }
          case 'dateOfDeath': {
            return (
              <div key={fieldConfig.id}>
                {props.entity[key] === null && (
                  <button
                    className="mt-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-md shadow-sm"
                    onClick={() => props.handleInputChange('dateOfDeath', new Date().toISOString())}
                  >
                    Добавить дату гибели
                  </button>
                )}

                {props.entity[key] !== null && (
                  <div className="mb-4">
                    <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                      {fieldConfig.label}
                    </label>
                    <input
                      type="date"
                      disabled={props.entityType === 'litter' || props.isFormDisabled}
                      id={fieldConfig.id}
                      name={fieldConfig.label}
                      value={formatSingleDate(props.entity[key])}
                      onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                      className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            )
          }
          case 'date': {
            const date = props.entity[key]
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <input
                  type="date"
                  disabled={!isFutureEvent(props.entity) || props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={date.length === 2 ? date : date[0]}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )
          }
          case 'gender': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <div className="mt-2">
                  {[
                    {
                      disabled: hasPuppies,
                      id: GENDER.MALE,
                      value: GENDER.MALE,
                      label: 'Кобель',
                    },
                    {
                      disabled: hasPuppies,
                      id: GENDER.FEMALE,
                      value: GENDER.FEMALE,
                      label: 'Сука',
                    }
                  ].map((option) => (
                    <label key={option.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={option.id}
                        name={fieldConfig.label}
                        disabled={option.disabled || props.isFormDisabled}
                        value={option.value}
                        checked={props.entity[key] === option.value}
                        onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                        className="form-radio"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )
          }
          case 'isNeutered': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <input
                  type="checkbox"
                  disabled={props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  checked={props.entity[key]}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
              </div>
            )
          }
          case 'breedId': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <select
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={props.breeds.find(breed => 'breedId' in props.entity && breed._id === props.entity.breedId)?._id}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  disabled={hasPuppies || props.entityType === 'newLitter' || props.isFormDisabled}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {props.breeds.map((breed) => (
                    <option key={breed._id} value={breed._id}>
                      {breed.name ? breed.name.rus : ''}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          case 'litterData': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <select
                  disabled={props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={props.litters.find(litter => 'litterData' in props.entity && litter._id === props.entity.litterData?.id)?._id}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {props.litters.map((litter) => (
                    <option key={litter._id} value={litter._id}>
                      {litter.litterTitle}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          case 'fatherData':
          case 'motherData': {
            const dogsList = key === 'fatherData' ? props.maleDogsList : props.femaleDogsList
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <select
                  disabled={props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={fieldConfig.valueGetter(dogsList, props.entity[key])}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {dogsList.map((dog) => (
                    <option key={dog._id} value={dog._id}>
                      {dog[fieldConfig.labelKey]}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          case 'puppyIds': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <select
                  multiple
                  disabled={props.isFormDisabled}
                  id={fieldConfig.id}
                  name={fieldConfig.label}
                  value={props.entity[key]}
                  onChange={(e) => fieldConfig.handler(e, key, props.handleInputChange)}
                  className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {props.puppiesList.map((puppy) => (
                    <option key={puppy._id} value={puppy._id}>
                      {puppy[fieldConfig.labelKey]}
                    </option>
                  ))}
                </select>
              </div>
            )
          }
          case 'eventType': {
            return (
              <div className="mb-4" key={fieldConfig.id}>
                <label htmlFor={fieldConfig.id} className="block text-sm font-medium">
                  {fieldConfig.label}
                </label>
                <div className="mt-2">
                  {fieldConfig.options.map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={fieldConfig.id}
                        name={fieldConfig.label}
                        disabled={props.isFormDisabled}
                        checked={props.newEventType === option.value}
                        value={option.value}
                        onChange={(e) => props.changeNewEventType(e.target.value as EVENT_TYPE)}
                        className="form-radio"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )
          }
          case 'repeat': {
            return (
              <div className="p-2" key={fieldConfig.id}>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={fieldConfig.id}
                    disabled={props.isFormDisabled}
                    checked={props.repeat}
                    onChange={props.switchRepeat}
                    className="form-checkbox"
                  />
                  <span>{fieldConfig.label}</span>
                </label>

                {props.repeat && (
                  <div className="mt-2">
                    <label htmlFor="frequency-input-id" className="block text-sm font-medium">
                      Следующее событие будет запланировано через
                    </label>
                    <select
                      disabled={props.isFormDisabled}
                      id="frequency-input-id"
                      name={fieldConfig.label}
                      value={props.frequencyInDays}
                      onChange={(e) => props.changeFrequency(Number(e.target.value))}
                      className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {PERIODS.map((per) => (
                        <option key={per.value} value={per.value}>
                          {per.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )
          }
          default: {
            return (<div>UNHANDLED INPUT</div>)
          }
        }
      })}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md flex justify-center items-center space-x-4"
      >
        <div className="flex-1"></div>
        <div className="w-48 text-center">
          {props.saveButtonLabel}
        </div>
        <div className="flex-1 flex justify-center">
          {props.isLoading && <CustomSpinner />}
        </div>
      </button>
    </form>
  )
}

export default BaseInfoEditor
