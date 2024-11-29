import {getRuTranslate} from "../../../g_shared/constants/translates";
import * as React from "react";
import {FieldData} from "../../../g_shared/types";
import {dogShortDataFields} from "../configurations";
import {getCommonFieldsConfig} from "../../../g_shared/methods/helpers/getCommonFieldsConfig";
import {useProfileDataStore} from "../../../f_entities/store/useProfileDataStore";
import useResponsiveGrid from "../../../f_entities/hooks/useResponsiveGrid";
import {useLocation} from "wouter";

type Props = {
  dogId: string,

}

const DogCard = ({dogId}: Props) => {
  const {getDogById, getBreedById} = useProfileDataStore();
  const {isSmall} = useResponsiveGrid()
  const [, setLocation] = useLocation();

  const getCardsConfig = (): FieldData[] => {
    const dog = getDogById(dogId);
    const breed = getBreedById(dog.breedId);
    const fields = isSmall ? ['fullName'] : dogShortDataFields
    return fields.map(fieldName => getCommonFieldsConfig(fieldName, dog, breed))
  }

  return (
    <div className="grid-area-secondaryFilter">
      <div className="flex flex-row p-2">
        {!isSmall && dogId && (
          <div
            className={`bg-gray-500 ${isSmall ? 'h-8 w-8' : 'h-12 w-12'} mr-2`}
          />
        )}
        {dogId && (
          <div className={`flex flex-col ${isSmall ? 'justify-start' : 'justify-around'}`}>
            {getCardsConfig().map((field, index) => (
              <div
                key={index}
                className={`grid ${isSmall ? 'grid-cols-[1fr_2fr]' : 'grid-cols-[1fr_1fr]'} gap-2`}
              >
                <div className="flex items-center justify-end pr-2">
                  <p className="text-sm mr-1">{getRuTranslate(field.key)}:</p>
                </div>
                <div>
                  <p className="text-sm font-bold truncate">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {dogId && (
        <div className="flex flex-row items-center justify-around">
          <button
            className={`py-2 px-4 ${isSmall ? 'text-sm' : 'text-base'} bg-blue-500 text-white rounded-md`}
            onClick={() => setLocation(`/app/population/dogs/dog/${dogId}`)}
          >
            Карточка собаки
          </button>
          <button
            className={`py-2 px-4 ${isSmall ? 'text-sm' : 'text-base'} bg-blue-500 text-white rounded-md`}
            onClick={() => setLocation(`/app/population/litters/litter/${getDogById(dogId).litterData?.id}`)}
          >
            Карточка помета
          </button>
        </div>
      )}
    </div>
  )
}

export default DogCard
