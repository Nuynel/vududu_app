import {GENDER} from "./dog";

export enum FORM_FIELDS {
  EMAIL = 'email',
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmPassword',
  CANINE_FEDERATION_NAME = 'canineFederationName',
  NATIONAL_BREED_CLUB_NAME = 'nationalBreedClubName',
  CANINE_CLUB_NAME = 'canineClubName',
  KENNEL_NAME = 'kennelName',
  NAME = 'name',
  DATE_OF_BIRTH = 'dateOfBirth',
  BREED_ID = 'breedId',
  GENDER = 'gender'
}

export type FormValues = {
  [FORM_FIELDS.EMAIL]: string;
  [FORM_FIELDS.PASSWORD]: string;
  [FORM_FIELDS.CONFIRM_PASSWORD]: string;
  [FORM_FIELDS.CANINE_FEDERATION_NAME]: string;
  [FORM_FIELDS.NATIONAL_BREED_CLUB_NAME]: string;
  [FORM_FIELDS.CANINE_CLUB_NAME]: string;
  [FORM_FIELDS.KENNEL_NAME]: string;
  [FORM_FIELDS.NAME]: string;
  [FORM_FIELDS.DATE_OF_BIRTH]: string;
  [FORM_FIELDS.BREED_ID]: string;
  [FORM_FIELDS.GENDER]: GENDER;
};
