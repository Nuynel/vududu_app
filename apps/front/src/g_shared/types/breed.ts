export enum BREED_STATUSES {
  MODERATED = 'moderated',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export const CROSSBREED: Breed = {
  _id: null,
  name: {
    rus: 'Метис',
    eng: 'Crossbreed'
  },
  group: null,
  organisations: [],
  status: BREED_STATUSES.APPROVED,
  standard: null,
  images: null,
}

export type Breed = {
  _id: string | null,
  name: {
    rus: string,
    eng: string,
  },
  group: number | null,// change to {[organisation]: {groupNumber... or another information}}
  organisations: string[],
  status: BREED_STATUSES,
  // issueId: string | null,
  standard: {
    rus: string | null,
    eng: string | null,
  } | null,
  images: string[] | null,
}
