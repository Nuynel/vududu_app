import {IncomingDogData, IncomingLitterData, OutgoingLitterData, RawLitterFields} from "../../../g_shared/types";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {useEffect, useState} from "react";
import {fixTimezone} from "../../../g_shared/methods/helpers";
import {createLitter, getPuppies, getStuds} from "../../../g_shared/methods/api";
import {GENDER} from "../../../g_shared/types/dog";
import * as React from "react";
import useGetInitialData from "../../../f_entities/hooks/useGetInitialData";
import BaseInfoEditor from "../../../e_features/BaseInfoEditor";
import {useBreeds} from "../../../f_entities/hooks/useBreeds";
import FormPageWrapper from "../../../e_features/FormPageWrapper";

const initNewLitterData: Pick<IncomingLitterData, RawLitterFields> = {
  fatherId: '',
  motherId: '',
  dateOfBirth: '',
  comments: '',
  puppyIds: [],
  breedId: null,
  litterTitle: '',
}

const LitterInformationCreator = () => {
  const [newLitterData, changeNewLitterData] = useState<Pick<IncomingLitterData, RawLitterFields>>({...initNewLitterData})
  const [maleDogsList, changeMaleDogsList] = useState<Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[]>([])
  const [femaleDogsList, changeFemaleDogsList] = useState<Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[]>([])
  const [puppiesList, changePuppiesList] = useState<Pick<IncomingDogData, '_id' | 'fullName' | 'breedId'>[]>([])

  const {pushNewLitter} = useProfileDataStore()
  const {getInitialData} = useGetInitialData()
  const {breeds, getAllBreeds} = useBreeds();

  const handleInputChange = (key, value) => {
    switch (key) {
      case 'dateOfBirth': {
        const dateWithTimezone = fixTimezone(value)
        return changeNewLitterData(
          (prevState): Pick<IncomingLitterData, RawLitterFields> => (
            {...prevState, [key]: dateWithTimezone}
          ))
      }
      case 'puppyIds': {
        if (value) {
          if (newLitterData.puppyIds.includes(value)) {
            return changeNewLitterData((prevState): Pick<IncomingLitterData, RawLitterFields> => (
              {...prevState, [key]: prevState.puppyIds.filter(id => id !== value)}
            ))
          } else {
            return changeNewLitterData((prevState): Pick<IncomingLitterData, RawLitterFields> => (
              {...prevState, [key]: [...prevState.puppyIds, value]}
            ))
          }
        } else {
          return changeNewLitterData((prevState): Pick<IncomingLitterData, RawLitterFields> => (
            {...prevState, [key]: []}
          ))
        }
      }
      default: {
        changeNewLitterData((prevState): Pick<IncomingLitterData, RawLitterFields> => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  const createLitterData = (): OutgoingLitterData => {
    const fatherFullName = maleDogsList.find((dog) => dog._id === newLitterData.fatherId).fullName
    const motherFullName = femaleDogsList.find((dog) => dog._id === newLitterData.motherId).fullName

    return {
      ...newLitterData,
      litterTitle: `${fatherFullName}/${motherFullName}`,
    }
  }

  const handleSubmit = () => {
    const litterData = createLitterData()
    createLitter(litterData)
      .then(async ({litter}) => {
        pushNewLitter(litter)
        return await getInitialData() // todo не перезапрашивать, а просто пушить локально
      })
      .then(() => window.history.back())
      .catch((e) =>{console.error(e)})
  }

  const handleSearch = (searchString: string, gender: GENDER) => {
    if (searchString.length > 0) {
      getStuds(searchString, gender).then(({studs}) => {
        if (gender === GENDER.MALE) changeMaleDogsList(studs)
        if (gender === GENDER.FEMALE) changeFemaleDogsList(studs)
      })
    }
  }

  useEffect(() => {
    if (newLitterData.dateOfBirth) {
      getPuppies(newLitterData.dateOfBirth, newLitterData.breedId).then(({puppies}) => {
        changePuppiesList(puppies)
      })
    }
  }, [newLitterData.dateOfBirth])

  useEffect(() => {
    if (newLitterData.motherId && newLitterData.fatherId) {
      const fatherBreed = maleDogsList.find(stud => stud._id === newLitterData.fatherId).breedId;
      const motherBreed = femaleDogsList.find(stud => stud._id === newLitterData.motherId).breedId;
      handleInputChange('breedId', fatherBreed === motherBreed ? fatherBreed : null);
    }
  }, [newLitterData.motherId, newLitterData.fatherId])

  useEffect(() => getAllBreeds(), [])

  return (
    <FormPageWrapper title={'Добавление помета'}>
      <BaseInfoEditor
        entityType={'newLitter'}
        entity={newLitterData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleSearchByGender={handleSearch}
        maleDogsList={maleDogsList}
        femaleDogsList={femaleDogsList}
        puppiesList={puppiesList}
        breeds={breeds}
        saveButtonLabel={'Сохранить'}
      />
    </FormPageWrapper>
  )
}

export default LitterInformationCreator
