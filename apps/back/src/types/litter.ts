import {ObjectId, WithId} from "mongodb";
// помет создается без щенков, они добавляются после? Или помет создается разом?

// может добавить в помет данные о количетсве щенков (сук и кобелей), а так же поле с комментариями?

// есть пометы которые принадлежат пользователю (в таком случае сука и/или кобель должны принадлежать пользователю)
// если пользователь получил помет от суки а затем продал её, как учтем? в таком случае помет же так и остался за пользователем, хотя собаки ему не принадлежат
// тогда добавлю поле isLinkedToOwner

export type DatabaseLitter = {
  profileId: ObjectId;

  fatherId: ObjectId;
  motherId: ObjectId;
  litterTitle: string;
  breedId: ObjectId | null;
  dateOfBirth: string;
  comments: string | null;
  puppyIds: ObjectId[];
}

export type ClientLitter = WithId<DatabaseLitter> & {
  fatherFullName: string;
  motherFullName: string;
  puppiesData: {
    id: string,
    name: string | null,
    fullName: string,
  }[]
}

export type RawLitterData = Pick<DatabaseLitter, 'dateOfBirth' | 'comments' | 'litterTitle'> & {
  fatherId: string;
  motherId: string;
  breedId: string | null;
  puppyIds: string[];
}
