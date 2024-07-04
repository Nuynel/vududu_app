import {useEffect, useState} from "react";
import {useParams} from "wouter";
import {IncomingDogData, IncomingLitterData, OutgoingDogData} from "../../../g_shared/types";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {fixTimezone} from "../../../g_shared/methods/helpers";
import {getLittersByDate, updateBaseDogInfo} from "../../../g_shared/methods/api";
import BaseInfoEditor from "../../../e_features/BaseInfoEditor";
import useGetInitialData from "../../../f_entities/hooks/useGetInitialData";
import {useBreeds} from "../../../f_entities/hooks/useBreeds";
import FormPageWrapper from "../../../e_features/FormPageWrapper";


const DogInformationEditor = () => {
  const [dog, changeDog] = useState<IncomingDogData | null>(null);
  const [litters, changeLitters] = useState<Pick<IncomingLitterData, '_id' | 'litterTitle' | 'dateOfBirth'>[]>([]);

  const params: {id: string} = useParams();

  const {getDogById, setDogsData, dogsData, getLitterById} = useProfileDataStore();
  const {breeds, getAllBreeds, setBreedSearchString} = useBreeds();
  const {getInitialData} = useGetInitialData()

  const handleInputChange = (key, value) => {
    const originalDogData = getDogById(dog._id)[key];
    switch (key) {
      case 'dateOfBirth':
      case 'dateOfDeath': {
        const dateWithTimezone = fixTimezone(value);
        return changeDog(
          (prevState): IncomingDogData => (
            {...prevState, [key]: dateWithTimezone, litterData: dateWithTimezone === originalDogData ? originalDogData.litterData : null}
          ))
      }
      case 'breedId': {
        return changeDog((prevState): IncomingDogData => (
          {...prevState, [key]: value, litterData: value === originalDogData ? originalDogData.litterData : null}
        ))
      }
      default: {
        changeDog((prevState): IncomingDogData => (
          {...prevState, [key]: value}
        ))
      }
    }
  }

  useEffect(() => {
    const dogData = getDogById(params.id);
    if (dogData) {
      const dogCopy = JSON.parse(JSON.stringify(dogData));
      changeDog(dogCopy);
    } else {
      changeDog(null);
    }
  }, [params])

  useEffect(() => {
    if (dog) {
      getLittersByDate(dog.dateOfBirth, dog.breedId).then(({litters}) => {
        changeLitters(litters)
      })
      getAllBreeds()
    }
  }, [dog])

  const handleSubmit = () => {
    const newBaseDogInfo: OutgoingDogData = {
      litterId: dog.litterData?.id || null,
      breedId: dog.breedId,
      gender: dog.gender,
      dateOfBirth: dog.dateOfBirth,
      dateOfDeath: dog.dateOfDeath,
      color: dog.color,
      name: dog.name,
      fullName: dog.fullName,
      microchipNumber: dog.microchipNumber,
      pedigreeNumber: dog.pedigreeNumber,
      tattooNumber: dog.tattooNumber,
      isNeutered: dog.isNeutered,
    }
    updateBaseDogInfo(newBaseDogInfo, dog._id)
      .then(async () => {
        setDogsData(dogsData.map((dogData => dogData._id === dog._id ? dog : dogData)))
        return await getInitialData()
      })
      .then(() => {
        window.history.back()
      })
  }

  if (!dog) return null;

  return (
    <FormPageWrapper title={dog.name || dog.fullName}>
      <BaseInfoEditor
        entityType={'dog'}
        entity={dog}
        handleInputChange={handleInputChange}
        handleSearch={setBreedSearchString}
        handleSubmit={handleSubmit}
        litters={litters}
        breeds={breeds}
        saveButtonLabel={'Сохранить'}
      />
    </FormPageWrapper>
  )
}

export default DogInformationEditor
