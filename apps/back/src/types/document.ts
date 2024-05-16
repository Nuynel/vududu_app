import {ObjectId} from "mongodb";

export type Document = { // breederId или все же userId?
  profileId: ObjectId;
  dogId: ObjectId | null;
  litterId: ObjectId | null;
  linkedEventId: ObjectId | null;
  link: string; // ссылка на облачный сервис где хранятся все картинки и т.д., но это в будущем
  type: string; // родословная, какие-то справки, положения...
  // публичный или приватный документ?
  // если приватный, то кому достпен?
}
