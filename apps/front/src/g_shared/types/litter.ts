export type IncomingLitterData = {
  _id: string;

  creatorProfileId: string;

  federationId: string | null;

  fatherId: string;
  motherId: string;
  litterTitle: string;
  breedId: string | null;
  dateOfBirth: string;
  comments: string | null;
  puppyIds: string[];

  puppiesCount: {
    male: number | null
    female: number | null
  }
  verified: {
    status: boolean
  }

  fatherFullName: string,
  motherFullName: string,
  puppiesData: {
    id: string,
    name: string | null,
    fullName: string | null,
    status: boolean,
  }[],
}

export type LittersStore = {
  littersData: IncomingLitterData[]
  setLittersData: (littersData: IncomingLitterData[]) => void,
}

export type RawLitterFields =
  | 'fatherId'
  | 'motherId'
  | 'dateOfBirth'
  | 'comments'
  | 'puppyIds'
  | 'breedId'
  | 'litterTitle'

export type OutgoingLitterData = Pick<IncomingLitterData, RawLitterFields>
