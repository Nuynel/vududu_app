import {ObjectId} from "mongodb";

// todo надо будет описать различные типы контактов

export type Contact = {
  profileId: ObjectId;
  name: string;
  phoneNumber: string | null;
  telegramUsername: string | null;
  email: string | null;
  notes: string | null;
  type: string;
}
