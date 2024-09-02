import {useEffect, useState} from "react";
import {Box, CheckBox, Text} from 'grommet';
import {IncomingDogData, IncomingLitterData, OutgoingDogData} from "../../../g_shared/types";
import {fixTimezone} from "../../../g_shared/methods/helpers";
import {createDog, getLittersByDate, updateBaseDogInfo} from "../../../g_shared/methods/api";
import BaseInfoEditor from "../../../e_features/BaseInfoEditor";
import useGetInitialData from "../../../f_entities/hooks/useGetInitialData";
import {useBreeds} from "../../../f_entities/hooks/useBreeds";
import FormPageWrapper from "../../../e_features/FormPageWrapper";
import useNewDogValidation from "./useNewDogValidation";
import * as React from "react";
import EntityList from "../../../e_features/EntityList";
import SubmitActionPopup from "../../../e_features/SubmitActionPopup";

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

  const handleSubmit = async () => {
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

  return (
    <FormPageWrapper title={'Добавление собаки'}>
      <BaseInfoEditor
        entityType={'newDogValidation'}
        entity={newDogValidationData}
        handleInputChange={handleNewDogValChange}
        handleSearch={setBreedSearchString}
        handleSubmit={handleValidateNewDog}
        litters={litters}
        breeds={breeds}
        isLoading={isLoading}
        saveButtonLabel={'Поиск собаки в базе'}
      />
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
        <Box margin={"small"} style={{minHeight: '24px'}}>
          <CheckBox
            label={'Здесь нет такой собаки'}
            checked={isNoMatch}
            onChange={(event) => switchIsNoMatch(event.target.checked)}
          />
        </Box>
      )}

      {dogDataMatch && dogDataMatch.length === 0 && (
        <Box margin={"small"} style={{minHeight: 'min-content'}} width={'100%'}>
          <Text textAlign={"center"}>
            Собак с такими данными не найдено, продолжите заполнение формы для добавления
          </Text>
        </Box>
      )}

      {((dogDataMatch && dogDataMatch.length === 0) || isNoMatch || selectedDogId) && (
        <Box margin={"small"} style={{minHeight: '24px'}}>
          <CheckBox
            label={'Собака принадлежит мне'}
            checked={isOwnDog}
            disabled={!!selectedDogId}
            onChange={(event) => switchIsOwnDog(event.target.checked)}
          />
        </Box>
      )}

      {((dogDataMatch && dogDataMatch.length === 0) || isNoMatch || selectedDogId) && (
        <BaseInfoEditor
          entityType={isOwnDog ? 'newOwnDog' : 'newOtherDog'}
          entity={newDogData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
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
    </FormPageWrapper>
  )
}

export default DogInformationCreator
