import {useEffect, useState} from "react";
import {IncomingDogData, IncomingLitterData, OutgoingDogData} from "../../../g_shared/types";
import {convertDateFormat, fixTimezone, formatSingleDate} from "../../../g_shared/methods/helpers";
import {createDog, getLittersByDate, updateBaseDogInfo} from "../../../g_shared/methods/api";
import BaseInfoEditor from "../../../e_features/BaseInfoEditor";
import useGetInitialData from "../../../f_entities/hooks/useGetInitialData";
import {useBreeds} from "../../../f_entities/hooks/useBreeds";
import useNewDogValidation from "./useNewDogValidation";
import * as React from "react";
import EntityList from "../../../e_features/EntityList";
import SubmitActionPopup from "../../../e_features/SubmitActionPopup";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";
import {GENDER} from "../../../g_shared/types/dog";
import {FORM_FIELDS, FormValues} from "../../../g_shared/types/form";
import {useForm} from "react-hook-form";
import {useTranslation} from "../../../f_entities/contexts/i18n";

const dogOwningDisputeText = 'Пожалуйста, напишите в службу поддержки vududu_support@vududu.ru. Укажите данные собаки (кличку, пол, дату рождения и породу), прикрепите доказательства владения собакой и мы рассмотрим Вашу заявку'

type AdditionalNewDogData = 'name' | 'fullName' | 'dateOfDeath' | 'microchipNumber' | 'tattooNumber' | 'pedigreeNumber' | 'color' | 'isNeutered' | 'litterData'

const initNewDogData: Pick<IncomingDogData, AdditionalNewDogData> = {
  name: '',
  fullName: '',
  dateOfDeath: null,
  litterData: null,
  microchipNumber: '',
  tattooNumber: '',
  pedigreeNumber: '',
  color: '',
  isNeutered: false,
}

const DogInformationCreator = () => {
  const [newDogData, changeNewDogData] = useState<Pick<IncomingDogData, AdditionalNewDogData>>({...initNewDogData})
  const [litters, changeLitters] = useState<Pick<IncomingLitterData, '_id' | 'litterTitle' | 'dateOfBirth'>[]>([]);
  const [isOwnDog, switchIsOwnDog] = useState<boolean>(false)
  const [isNoMatch, switchIsNoMatch] = useState<boolean>(false)
  const [showPopup, switchShowPopup] = useState<boolean>(false)
  const [selectedDogId, changeSelectedDogId] = useState<string | null>(null)
  const {breeds, getAllBreeds, setBreedSearchString} = useBreeds();
  const {isSmall} = useResponsiveGrid()

  const {getInitialData} = useGetInitialData()
  const {
    newDogValidationData,
    handleValidateNewDog,
    dogDataMatch,
    isLoading,
    handleNewDogValChange
  } = useNewDogValidation()

  const handleInputChange = (key, value) => {
    switch (key) {
      case 'dateOfDeath': {
        const dateWithTimezone = fixTimezone(value);
        return changeNewDogData(
          (prevState): Pick<IncomingDogData, AdditionalNewDogData> => (
            {...prevState, [key]: dateWithTimezone}
          ))
      }
      case 'breedId': {
        handleNewDogValChange('litterData', null)
        return changeNewDogData((prevState): Pick<IncomingDogData, AdditionalNewDogData> => (
          {...prevState, [key]: value}
        ))
      }
      default: {
        changeNewDogData((prevState): Pick<IncomingDogData, AdditionalNewDogData> => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  const getEntityList = () => {
    return dogDataMatch.map(entity => ({
      _id: entity._id,
      icon: null,
      title: entity.fullName,
      hasOwner: !!entity.ownerProfileId,
    }))
  }

  const onSubmit = async () => {
    const newDog: OutgoingDogData = {
      litterId: newDogData.litterData?.id || null,
      breedId: newDogValidationData.breedId,
      gender: newDogValidationData.gender,
      dateOfBirth: newDogValidationData.dateOfBirth,
      dateOfDeath: newDogData.dateOfDeath,
      color: newDogData.color,
      name: newDogData.name,
      fullName: newDogData.fullName,
      microchipNumber: newDogData.microchipNumber,
      pedigreeNumber: newDogData.pedigreeNumber,
      tattooNumber: newDogData.tattooNumber,
      isNeutered: newDogData.isNeutered,
    }

    const newDogPromise: Promise<{message: string}> = selectedDogId ? updateBaseDogInfo(newDog, selectedDogId, true) : createDog(newDog)

    newDogPromise
      .then(async () => await getInitialData())
      .then(() => window.history.back())
      .catch((e) => console.error(e))
  }

  useEffect(() => {
    getLittersByDate(newDogValidationData.dateOfBirth, newDogValidationData.breedId)
      .then(({litters}) => {
        changeLitters(litters)
      })
  }, [newDogData, dogDataMatch])

  useEffect(() => {
    changeNewDogData({...initNewDogData})
    changeSelectedDogId(null)
    switchIsOwnDog(false)
  }, [newDogValidationData])

  useEffect(() => getAllBreeds(), [])

  const chooseDog = (id) => {
    changeSelectedDogId(id)
    const selectedDogData = dogDataMatch.find(dogData => dogData._id === id)
    if (selectedDogData.ownerProfileId) return switchShowPopup(true)
    switchIsOwnDog(true)
    changeNewDogData((prevState): Pick<IncomingDogData, AdditionalNewDogData> => (
      {
        ...prevState,
        fullName: selectedDogData.fullName,
        name: selectedDogData.name,
        dateOfDeath: selectedDogData.dateOfDeath,
        color: selectedDogData.color,
        isNeutered: selectedDogData.isNeutered,
        litterData: selectedDogData.litterData,
      }
    ))
  }

  const {translate} = useTranslation();

  const formFieldOptions = {
    [FORM_FIELDS.DATE_OF_BIRTH]: {
      // required: translate("requiredEmail"),
      // pattern: {
      //   value: /^\S+@\S+$/i,
      //   message: translate("invalidEmail"),
      // },
    },
    [FORM_FIELDS.BREED_ID]: {
      // required: translate("requiredPassword"),
      // minLength: {
      //   value: 6,
      //   message: translate("passwordMinLength"),
      // },
    },
    [FORM_FIELDS.GENDER]: {
      // required: translate("requiredPassword"),
      // minLength: {
      //   value: 6,
      //   message: translate("passwordMinLength"),
      // },
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>();

  return (
    <div className='w-full px-4 relative'>
      <div className={`flex flex-col rounded-xl ${isSmall ? 'justify-around' : 'justify-end'} items-start w-full bg-white py-4 px-6`}>
        <div className="mb-4">
          <label className="block text-sm font-medium">
            Дата рождения
          </label>
          <input
            type="date"
            value={formatSingleDate(newDogValidationData.dateOfBirth)}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Проверяем и преобразуем формат даты
              const formattedValue = convertDateFormat(inputValue);
              // setDateValue(formattedValue);
              // Вызываем ваш обработчик
              handleNewDogValChange('dateOfBirth', formattedValue)
            }}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">
            Порода
          </label>
          <select
            value={breeds.find(breed => 'breedId' in newDogValidationData && breed._id === newDogValidationData.breedId)?._id}
            onChange={(e) => handleNewDogValChange('breedId', e)}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {breeds.map((breed) => (
              <option key={breed._id} value={breed._id}>
                {breed.name ? breed.name.rus : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">
            Пол
          </label>
          <div className="mt-2">
            {[
              {
                id: GENDER.MALE,
                value: GENDER.MALE,
                label: 'Кобель',
              },
              {
                id: GENDER.FEMALE,
                value: GENDER.FEMALE,
                label: 'Сука',
              }
            ].map((option) => (
              <label key={option.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={option.id}
                  value={option.value}
                  checked={newDogValidationData.gender === option.value}
                  onChange={(e) => handleNewDogValChange('gender', e.target.value)}
                  className="form-radio"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/*<BaseInfoEditor*/}
        {/*  entityType={'newDogValidation'}*/}
        {/*  entity={newDogValidationData}*/}
        {/*  handleInputChange={handleNewDogValChange}*/}
        {/*  handleSearch={setBreedSearchString}*/}
        {/*  handleSubmit={handleValidateNewDog}*/}
        {/*  litters={litters}*/}
        {/*  breeds={breeds}*/}
        {/*  isLoading={isLoading}*/}
        {/*  saveButtonLabel={'Поиск собаки в базе'}*/}
        {/*/>*/}
        {dogDataMatch && dogDataMatch.length > 0 && (
          <EntityList
            list={getEntityList()}
            setActiveId={chooseDog}
            hasColorIndicator={false}
            hasIcons={false}
            isDogChooser
          />
        )}

        {(dogDataMatch && dogDataMatch.length > 0) || (dogDataMatch && dogDataMatch.length > 0 && !selectedDogId) && (
          <div className="m-2" style={{ minHeight: '24px' }}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isNoMatch}
                onChange={(event) => switchIsNoMatch(event.target.checked)}
                className="form-checkbox"
              />
              <span>Здесь нет такой собаки</span>
            </label>
          </div>
        )}

        {dogDataMatch && dogDataMatch.length === 0 && (
          <div className="m-2 w-full" style={{ minHeight: 'min-content' }}>
            <p className="text-center">
              Собак с такими данными не найдено, продолжите заполнение формы для добавления
            </p>
          </div>
        )}

        {((dogDataMatch && dogDataMatch.length === 0) || isNoMatch || selectedDogId) && (
          <div className="m-2" style={{ minHeight: '24px' }}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isOwnDog}
                disabled={!!selectedDogId}
                onChange={(event) => switchIsOwnDog(event.target.checked)}
                className="form-checkbox"
              />
              <span>Собака принадлежит мне</span>
            </label>
          </div>

        )}

        {((dogDataMatch && dogDataMatch.length === 0) || isNoMatch || selectedDogId) && (
          <BaseInfoEditor
            entityType={isOwnDog ? 'newOwnDog' : 'newOtherDog'}
            entity={newDogData}
            handleInputChange={handleInputChange}
            handleSubmit={onSubmit}
            litters={litters}
            saveButtonLabel={'Сохранить'}
          />
        )}

        {showPopup && (
          <SubmitActionPopup
            text={dogOwningDisputeText}
            closePopup={() => switchShowPopup(false)}
          />
        )}
      </div>
    </div>
  )
}

export default DogInformationCreator
