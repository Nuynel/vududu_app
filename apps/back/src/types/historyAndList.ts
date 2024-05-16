import {ObjectId} from "mongodb";

// History and lists

export type History = {
  dogId: ObjectId | null;
  profileId: ObjectId;
  list: { id: ObjectId; date: string; }[];
}

export type ContactList = {
  profileId: ObjectId;
  contacts: ObjectId[];
}
