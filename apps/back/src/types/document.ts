import {ObjectId, WithId} from "mongodb";
import {Permissions, ProfilePermissionsByEntity} from "./dataPermissions";

export enum DOCUMENT_TYPE {
  PHOTO = 'PHOTO', // просто фотки собаки
  HEALTH_CERTIFICATE = 'HEALTH_CERTIFICATE', // сертификаты здоровья: генетика, дисплазии и тд
  DOCUMENT = 'DOCUMENT', // родухи, щенячки и тд
  ACHIEVEMENT = 'ACHIEVEMENT', // достижения - выставки, соревнования, испытания
  MEDICAL_RECORD = 'MEDICAL_RECORD', // медкарта приема ветврача
}

// todo RawDocumentFields & RawDocumentData

export type DatabaseDocument = { // breederId или все же userId?
  profileId: ObjectId;
  dogIds: ObjectId[] | null;
  litterId: ObjectId | null;
  eventId: ObjectId | null;
  link: string | null; // ссылка на облачный сервис где хранятся все картинки и т.д., но это в будущем
  type: DOCUMENT_TYPE;
  data: Buffer | null;
  permissions: Permissions;
}

type NonNullableClientDocumentFields = 'profileId' | 'type' | 'permissions'

export type ClientDocument = WithId<DatabaseDocument>

export type ProtectedClientDocument = Omit<ClientDocument, NonNullableClientDocumentFields> & {
  profileId: ObjectId | null;
  type: DOCUMENT_TYPE | null;
  permissions: ProfilePermissionsByEntity | null;
}
