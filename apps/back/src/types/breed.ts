import {ObjectId} from "mongodb";

export enum BREED_STATUSES {
  MODERATED = 'moderated',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export type Breed = {
  name: {
    rus: string,
    eng: string,
  },
  group: number | null,
  organisations: (string | ObjectId)[],
  status: BREED_STATUSES,
  issueId: ObjectId | null,
  standard: {
    rus: string | null,
    eng: string | null,
  } | null,
  images: string[] | null,
}

export type BreedIssue = {
  status: BREED_STATUSES,
  breedId: ObjectId,
  breedDescription: string,
  comment: string | null,
  profileId: ObjectId,
  email: string,
}
