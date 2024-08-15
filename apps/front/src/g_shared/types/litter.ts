export type IncomingLitterData = {
  _id: string;

  creatorProfileId: string | null;

  federationId: string | null;

  fatherData: {id: string, fullName: string} | null;
  motherData: {id: string, fullName: string} | null;
  litterTitle: string | null;
  breedId: string | null;
  dateOfBirth: string | null;
  comments: string | null;
  puppyIds: string[] | null;
  verifiedPuppyIds: string[] | null;
  litterSummary: {
    male: number | null
    female: number | null
  };
  verified: { fatherOwner: boolean, motherOwner: boolean } | null;

  puppiesData: {id: string, fullName: string, verified: boolean}[] | null;
}

export type LittersStore = {
  littersData: IncomingLitterData[]
  setLittersData: (littersData: IncomingLitterData[]) => void,
}

export type RawLitterFields =
  | 'fatherData'
  | 'motherData'
  | 'dateOfBirth'
  | 'comments'
  | 'puppyIds'
  | 'verifiedPuppyIds'
  | 'breedId'
  | 'litterTitle'

export type OutgoingLitterData = Pick<IncomingLitterData, RawLitterFields>
