export enum FORM_FIELDS {
  EMAIL = 'email',
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmPassword'
}

export type FormValues = {
  [FORM_FIELDS.EMAIL]: string;
  [FORM_FIELDS.PASSWORD]: string;
  [FORM_FIELDS.CONFIRM_PASSWORD]: string;
};
