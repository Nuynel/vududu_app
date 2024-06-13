import {Breed, IncomingDogData} from "../../types";
import {formatSingleDate} from "./dateTimeHelpers";
import {GENDER} from "../../types/dog";

export const getCommonFieldsConfig = (fieldName: string, dog: IncomingDogData, breed: Breed) => {
  switch (fieldName) {
    case 'dateOfBirth': return {
      key: fieldName,
      value: formatSingleDate(dog.dateOfBirth),
      link: false,
      linkValue: null,
    }
    case 'litterData': return {
      key: fieldName,
      value: dog.litterData ? dog.litterData.title : '-',
      link: !!dog?.litterData?.id,
      linkValue: `/dogs/litter/${dog.litterData ? dog.litterData.id : ''}`,
    }
    case 'isNeutered': return {
      key: fieldName,
      value: dog.isNeutered ? 'Да' : 'Нет',
      link: false,
      linkValue: null,
    }
    case 'gender': return {
      key: fieldName,
      value: dog.gender === GENDER.MALE ? 'Кобель' : 'Сука',
      link: false,
      linkValue: null,
    }
    case 'breedId': return {
      key: fieldName,
      value: breed?.name?.rus,
      link: false,
      linkValue: null,
    }
    default: return {
      key: fieldName,
      value: dog[fieldName] || '-',
      link: false,
      linkValue: null,
    }

  }
}
