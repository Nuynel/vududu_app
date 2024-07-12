import {useEffect, useState} from 'react'
import {useLocation, useParams} from "wouter";
import EntityPage from "../../../e_features/EntityPage";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {BlocksConfig, Breed, IncomingDogData, FieldData} from "../../../g_shared/types";
import {BLOCK_TYPES} from "../../../g_shared/types/components";
import {getFieldsConfigFromHistoryRecords} from "../helpers";
import {dogBaseDataFields} from './configurations'
import {getCommonFieldsConfig} from "../../../g_shared/methods/helpers/getCommonFieldsConfig";
import {Paths} from "../../../g_shared/constants/routes";
import EntityPageWrapper from "../../../e_features/EntityPageWrapper";

const DogInformation = () => {
  const [dog, setDog] = useState<IncomingDogData | null>(null);
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
    setLocation(`/dogs/dog/${params.id}/editor`);
  }

  const closeDogPage = () => {
    setLocation(Paths.dogs);
  }

  const getCardsConfig = (): BlocksConfig => {
    const commonFields: FieldData[] = dogBaseDataFields.map(fieldName => getCommonFieldsConfig(fieldName, dog, breed))

    return {
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
          blockFields: getFieldsConfigFromHistoryRecords(dog.reproductiveHistory.litters, '/litters/litter')
        },
      ]
    }
  }

  return (
    <EntityPageWrapper
      title={dog.name}
      closeEntityPage={closeDogPage}
    >
      <EntityPage
        config={getCardsConfig()}
        openBaseInfoEditor={openDogEditor}
      />
    </EntityPageWrapper>
  )
}

export default DogInformation
