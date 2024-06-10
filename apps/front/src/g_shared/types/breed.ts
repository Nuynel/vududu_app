export enum BREED_STATUSES {
  MODERATED = 'moderated',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export type Breed = {
  _id: string,
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
