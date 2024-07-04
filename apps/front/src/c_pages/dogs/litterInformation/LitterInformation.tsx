import {useEffect, useState} from 'react'
import {useLocation, useParams} from "wouter";
import EntityPage from "../../../e_features/EntityPage";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import {BlocksConfig, FieldData, IncomingLitterData} from "../../../g_shared/types";
import {formatSingleDate} from "../../../g_shared/methods/helpers";
import {BLOCK_TYPES} from "../../../g_shared/types/components";
import {getFieldsConfigFromPuppiesList} from "../helpers";
import {litterBaseDataFields} from './configurations'
import {Paths} from "../../../g_shared/constants/routes";

const LitterInformation = () => {
  const [litter, setLitter] = useState<IncomingLitterData | null>(null);

  const [, setLocation] = useLocation();
  const params: {id: string} = useParams();

  const {getLitterById} = useProfileDataStore();

  useEffect(() => {
    setLitter(getLitterById(params.id))
  }, [params])

  if (!litter) return null;


  const openLitterEditor = () => {
    setLocation(`/litters/litter/${params.id}/editor`);
  }

  const getCardsConfig = (): BlocksConfig => {
    const commonFields: FieldData[] = litterBaseDataFields.map(fieldName => {
      switch (fieldName) {
        case 'fatherFullName': return {
          key: fieldName,
          value: litter.fatherFullName,
          link: true,
          linkValue: `/dogs/dog/${litter.fatherId}`,
        }
        case 'motherFullName': return {
          key: fieldName,
          value:  litter.motherFullName,
          link: true,
          linkValue: `/dogs/dog/${litter.motherId}`,
        }
        case 'dateOfBirth': return {
          key: fieldName,
          value: formatSingleDate(litter.dateOfBirth),
          link: false,
        }
        default: return {
          key: fieldName,
          value: litter[fieldName] || '-',
          link: false,
        }
      }
    })

    return {
      title: `${formatSingleDate(litter.dateOfBirth)}, ${litter.litterTitle}`,
      commonData: {
        blockName: 'commonData',
        blockType: BLOCK_TYPES.COMMON,
        blockFields: commonFields,
      },
      additionalData: [
        {
          blockName: 'puppies',
          blockType: BLOCK_TYPES.ARRAY,
          blockFields: getFieldsConfigFromPuppiesList(litter.puppiesData)
        },
      ]
    }
  }

  return (
    <EntityPage
      config={getCardsConfig()}
      openBaseInfoEditor={openLitterEditor}
      closeEntityPage={() => setLocation(Paths.dogs)}
    />
  )
}

export default LitterInformation
