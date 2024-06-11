import {NewDog} from "./dog";

export type NewLitter = {
  fatherId: string;
  motherId: string;
  dateOfBirth: string;
  registrationId: null; // ссылка на документ (общепометная карта)
  puppyIds: string[];
  breedId: string | null;
  // puppiesCount: {
  //   male: number | null,
  //   female: number | null,
  //   // dead: number | null, надо будет узнать у заводчиков, хотят ли они вносить эту информацию
  // };
  litterCardId: null;
  comments: string | null;
}

export type LitterData = NewLitter & {
  _id: string;
  profileId: string;
  isLinkedToOwner: boolean;
  fatherFullName: string | null,
  fatherName: string | null,
  motherFullName: string | null,
  motherName: string | null,
  litterTitle: string;
  puppiesData: {
    id: string,
    name: string | null,
    fullName: string | null,
  }[]
}

export type LittersStore = {
  littersData: LitterData[]
  setLittersData: (littersData: LitterData[]) => void,
}

export type NewLitterFormFields = 'fatherId' | 'motherId' | 'dateOfBirth' | 'comments' | 'puppyIds' | 'breedId'
  // | 'puppiesCount'
