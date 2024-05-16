import {useEffect, useState} from 'react'
import {useLocation, useParams} from "wouter";
import EntityPage from "../../../e_features/EntityPage";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {BlocksConfig, DogData, FieldData} from "../../../g_shared/types";
import {BLOCK_TYPES} from "../../../g_shared/types/components";
import {formatSingleDate} from "../../../g_shared/methods/helpers";
import {GENDER} from "../../../g_shared/types/dog";
import {getFieldsConfigFromHistoryRecords} from "../helpers";
import {dogBaseDataFields} from './configurations'

const DogInformation = () => {
  const [dog, setDog] = useState<DogData | null>(null);
  const [, setLocation] = useLocation();

  const params: {id: string} = useParams();

  const {getDogById} = useProfileDataStore();

  useEffect(() => {
    setDog(getDogById(params.id))
  }, [params])

  if (!dog) return null;

  const openDogEditor = () => {
    setLocation(`/dogs/${params.id}/editor`);
  }

  const closeDogPage = () => {
    setLocation('/dogs');
  }

  const getCardsConfig = (): BlocksConfig => {
    const commonFields: FieldData[] = dogBaseDataFields.map(fieldName => {
      switch (fieldName) {
        case 'dateOfBirth': return {
          key: fieldName,
          value: formatSingleDate(dog.dateOfBirth),
          link: false,
        }
        case 'litterTitle': return {
          key: fieldName,
          value: dog.litterTitle || '-',
          link: !!dog.litterId,
          linkValue: `/dogs/litter/${dog.litterId}`,
        }
        case 'isNeutered': return {
          key: fieldName,
          value: dog.isNeutered ? 'Да' : 'Нет',
          link: false,
        }
        case 'gender': return {
          key: fieldName,
          value: dog.gender === GENDER.MALE ? 'Кобель' : 'Сука',
          link: false,
        }
        default: return {
          key: fieldName,
          value: dog[fieldName] || '-',
          link: false,
        }

      }
    })

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
