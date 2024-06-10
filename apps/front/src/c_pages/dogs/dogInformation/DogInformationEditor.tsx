import {useEffect, useState} from "react";
import {useParams} from "wouter";
import {BaseDogInfo, DogData, Breed} from "../../../g_shared/types";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {getFormatTimezoneOffset} from "../../../g_shared/methods/helpers";
import {getBreeds, getLittersByDate, updateBaseDogInfo} from "../../../g_shared/methods/api";
import BaseInfoEditor from "../../../e_features/BaseInfoEditor";
import useGetInitialData from "../../../f_entities/hooks/useGetInitialData";


const DogInformationEditor = () => {
  const [dog, changeDog] = useState<DogData | null>(null);
  const [litters, changeLitters] = useState<{_id: string, litterTitle: string}[]>([]);
  const [breeds, changeBreeds] = useState<Breed[]>([]);

  const params: {id: string} = useParams();

  const {getDogById, setDogsData, dogsData, getLitterById} = useProfileDataStore();
  const {getInitialData} = useGetInitialData()

  const handleInputChange = (key, value) => {
    switch (key) {
      case 'dateOfBirth': {
        if (value && value.includes('Z')) {
          const dateWithTimeZone = value.replace('Z', getFormatTimezoneOffset())
          return changeDog(
            (prevState): DogData => (
              {...prevState, [key]: dateWithTimeZone, litterId: null, litterTitle: null}
            ))
        }
        if (value && value.length >= 10) {
          const dateWithTime = (new Date(value)).setHours(12)
          const dateWithTimeZone = (new Date(dateWithTime)).toISOString().replace('Z', getFormatTimezoneOffset())
          return changeDog(
            (prevState): DogData => (
              {...prevState, [key]: dateWithTimeZone, litterId: null, litterTitle: null}
            ))
        }
        return changeDog(
          (prevState): DogData => (
            {...prevState, [key]: value, litterId: null, litterTitle: null}
          ))
      }
      default: {
        changeDog((prevState): DogData => (
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
      getLittersByDate(dog.dateOfBirth).then(({litters}) => {
        changeLitters(litters.map(
          ({_id}) => ({_id, litterTitle: getLitterById(_id).litterTitle})
        ))
      })
      getBreeds().then(({breeds: newBreeds}) => changeBreeds(newBreeds))
    }
  }, [dog])

  const handleSubmit = () => {
    const newBaseDogInfo: BaseDogInfo = {
      litterId: dog.litterId,
      litterTitle: dog.litterTitle, //todo зачем тут litterTitle?
      breedId: dog.breedId,
      gender: dog.gender,
      dateOfBirth: dog.dateOfBirth,
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

  const handleSearch = (searchString: string) => {
    getBreeds(searchString).then(({breeds: newBreeds}) => changeBreeds(newBreeds))
  }

  if (!dog) return null;

  return (
    <BaseInfoEditor
      title={dog.name || dog.fullName}
      entityType={'dog'}
      entity={dog}
      handleInputChange={handleInputChange}
      handleSearch={handleSearch}
      handleSubmit={handleSubmit}
      litters={litters}
      breeds={breeds}
    />
  )
}

export default DogInformationEditor
