import {Breed, DogData} from "../../types";
import {formatSingleDate} from "./dateTimeHelpers";
import {GENDER} from "../../types/dog";

export const getCommonFieldsConfig = (fieldName: string, dog: DogData, breed: Breed) => {
  switch (fieldName) {
    case 'dateOfBirth': return {
      key: fieldName,
      value: formatSingleDate(dog.dateOfBirth),
      link: false,
      linkValue: null,
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
