import {useEffect, useState} from "react";
import {IncomingDogData, IncomingLitterData, OutgoingDogData, RawDogFields} from "../../../g_shared/types";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {fixTimezone} from "../../../g_shared/methods/helpers";
import {createDog, getLittersByDate} from "../../../g_shared/methods/api";
import BaseInfoEditor from "../../../e_features/BaseInfoEditor";
import useGetInitialData from "../../../f_entities/hooks/useGetInitialData";
import {useBreeds} from "../../../f_entities/hooks/useBreeds";

const initNewDogData: Pick<IncomingDogData, RawDogFields | 'litterData'> = {
  name: '',
  fullName: '',
  dateOfBirth: '',
  dateOfDeath: null,
  breedId: null,
  gender: null,
  litterData: null,
  microchipNumber: '',
  tattooNumber: '',
  pedigreeNumber: '',
  color: '',
  isNeutered: false,
}

const DogInformationCreator = () => {
  const [newDogData, changeNewDogData] = useState<Pick<IncomingDogData, RawDogFields | 'litterData'>>({...initNewDogData})
  const [litters, changeLitters] = useState<Pick<IncomingLitterData, '_id' | 'litterTitle'>[]>([]);
  const {breeds, getAllBreeds, searchBreeds} = useBreeds();

  const {pushNewDog, getLitterById} = useProfileDataStore()
  const {getInitialData} = useGetInitialData()

  const handleInputChange = (key, value) => {
    switch (key) {
      case 'dateOfBirth':
      case 'dateOfDeath': {
        const dateWithTimezone = fixTimezone(value);
        return changeNewDogData(
          (prevState): Pick<IncomingDogData, RawDogFields | 'litterData'> => (
            {...prevState, [key]: dateWithTimezone}
          ))
      }
      case 'breedId': {
        return changeNewDogData((prevState): Pick<IncomingDogData, RawDogFields | 'litterData'> => (
          {...prevState, [key]: value, litterData: null}
        ))
      }
      default: {
        changeNewDogData((prevState): Pick<IncomingDogData, RawDogFields | 'litterData'> => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  const handleSubmit = () => {
    const newDog: OutgoingDogData = {
      litterId: newDogData.litterData?.id || null,
      breedId: newDogData.breedId,
      gender: newDogData.gender,
      dateOfBirth: newDogData.dateOfBirth,
      dateOfDeath: newDogData.dateOfDeath,
      color: newDogData.color,
      name: newDogData.name,
      fullName: newDogData.fullName,
      microchipNumber: newDogData.microchipNumber,
      pedigreeNumber: newDogData.pedigreeNumber,
      tattooNumber: newDogData.tattooNumber,
      isNeutered: newDogData.isNeutered,
    }

    createDog(newDog)
      .then(async ({dog}) => {
        pushNewDog(dog)
        return await getInitialData() // todo не перезапрашивать, а просто пушить локально
      })
      .then(() => window.history.back())
      .catch((e) =>{ console.error(e) })
  }

  useEffect(() => {
    getLittersByDate(newDogData.dateOfBirth, newDogData.breedId)
      .then(({litters}) => {
        changeLitters(litters.map(
          ({_id}) => ({_id, litterTitle: getLitterById(_id).litterTitle})
        ))
      })
  }, [newDogData])

  useEffect(() => getAllBreeds(), [])

  return (
    <BaseInfoEditor
      title={'Добавление собаки'}
      entityType={'dog'}
      entity={newDogData}
      handleInputChange={handleInputChange}
      handleSearch={searchBreeds}
      handleSubmit={handleSubmit}
      litters={litters}
      breeds={breeds}
    />
  )
}

export default DogInformationCreator
