import {ObjectId} from "mongodb";
// помет создается без щенков, они добавляются после? Или помет создается разом?

// может добавить в помет данные о количетсве щенков (сук и кобелей), а так же поле с комментариями?

// есть пометы которые принадлежат пользователю (в таком случае сука и/или кобель должны принадлежать пользователю)
// если пользователь получил помет от суки а затем продал её, как учтем? в таком случае помет же так и остался за пользователем, хотя собаки ему не принадлежат
// тогда добавлю поле isLinkedToOwner

export type NewLitter = {
  fatherId: ObjectId | string;
  motherId: ObjectId | string;
  breedId: ObjectId | null;
  dateOfBirth: string;
  registrationId: ObjectId | null; // ссылка на документ (общепометная карта)
  puppyIds: ObjectId[];
  puppiesCount?: {
    male: number | null,
    female: number | null,
    // dead: number | null, надо будет узнать у заводчиков, хотят ли они вносить эту информацию
  };
  litterCardId: ObjectId | null;
  comments: string | null;
}

export type Litter = NewLitter & {
  profileId: ObjectId | string;
  isLinkedToOwner: boolean;
}
