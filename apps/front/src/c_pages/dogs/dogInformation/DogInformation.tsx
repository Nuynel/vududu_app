import {useEffect, useState} from 'react'
import {useLocation, useParams} from "wouter";
import EntityPage from "../../../e_features/EntityPage";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {BlocksConfig, Breed, DogData, FieldData} from "../../../g_shared/types";
import {BLOCK_TYPES} from "../../../g_shared/types/components";
import {formatSingleDate} from "../../../g_shared/methods/helpers";
import {GENDER} from "../../../g_shared/types/dog";
import {getFieldsConfigFromHistoryRecords} from "../helpers";
import {dogBaseDataFields} from './configurations'
import {getCommonFieldsConfig} from "../../../g_shared/methods/helpers/getCommonFieldsConfig";

const DogInformation = () => {
  const [dog, setDog] = useState<DogData | null>(null);
  const [breed, setBreed] = useState<Breed | null>(null);
  const [, setLocation] = useLocation();

  const params: {id: string} = useParams();

  const {getDogById, getBreedById} = useProfileDataStore();

  useEffect(() => {
    const currDog = getDogById(params.id)
    if (currDog) {
      setDog(currDog)
      setBreed(getBreedById(currDog.breedId))
    }
  }, [params])

  if (!dog) return null;

  const openDogEditor = () => {
    setLocation(`/dogs/${params.id}/editor`);
  }

  const closeDogPage = () => {
    setLocation('/dogs');
  }

  const getCardsConfig = (): BlocksConfig => {
    const commonFields: FieldData[] = dogBaseDataFields.map(fieldName => getCommonFieldsConfig(fieldName, dog, breed))

    return {
      title: dog.name,
      commonData: {
        blockName: 'commonData',
        blockType: BLOCK_TYPES.COMMON,
        blockFields: commonFields,
      },
      additionalData: [
        {
          blockName: 'vaccinations',
          blockType: BLOCK_TYPES.ARRAY,
          blockFields: getFieldsConfigFromHistoryRecords(dog.vaccinations)
        },
        {
          blockName: 'treatments',
          blockType: BLOCK_TYPES.ARRAY,
          blockFields: getFieldsConfigFromHistoryRecords(dog.treatments)
        },
        {
          blockName: 'litters',
          blockType: BLOCK_TYPES.ARRAY,
          blockFields: getFieldsConfigFromHistoryRecords(dog.reproductiveHistory.litters, '/dogs/litter')
        },
      ]
    }
  }

  return (
    <EntityPage
      config={getCardsConfig()}
      openBaseInfoEditor={openDogEditor}
      closeEntityPage={closeDogPage}
    />
  )
}

export default DogInformation
