import {Response} from 'express';
import errorMessages from '../constants/error_messages.json';
import {MongoError} from "mongodb";
import {JsonWebTokenError} from "jsonwebtoken";
import {getTimestamp} from "./index";

export enum ERROR_NAME {
  WRONG_CREDENTIALS = '400_WRONG_CREDENTIALS',
  WRONG_CLIENT_TYPE = '400_WRONG_CLIENT_TYPE',
  WRONG_EMAIL = '400_WRONG_EMAIL',
  EMAIL_ALREADY_EXISTS = '400_EMAIL_ALREADY_EXISTS',
  WRONG_PASSWORD = '400_WRONG_PASSWORD',
  INACTIVE_PROFILE = '400_INACTIVE_PROFILE',
  INCOMPLETE_INCOMING_DATA = '400_INCOMPLETE_INCOMING_DATA',
  INVALID_PAYLOAD = '400_INVALID_PAYLOAD',
  NO_COOKIES = '400_NO_COOKIES',
  INVALID_PROFILE_TYPE = '400_INVALID_PROFILE_TYPE',

  INVALID_REFRESH_TOKEN = '401_INVALID_REFRESH_TOKEN',
  INVALID_ACCESS_TOKEN = '401_INVALID_ACCESS_TOKEN',

  DELETE_ERROR = '403_FORBIDDEN',

  INTERNAL_SERVER_ERROR = '500_INTERNAL_SERVER_ERROR',
  TOKENS_GENERATION_ERROR = '500_TOKENS_GENERATION_ERROR',
  DATABASE_ERROR = '500_DATABASE_ERROR',
  HASHING_ERROR = '500_HASHING_ERROR',
}

type ErrorMessages = {
  [key in ERROR_NAME]: {
    RU: string;
  };
};

const ERRORS: ErrorMessages = errorMessages;

export const getErrorMessage = (errorName: ERROR_NAME): string => {
  return ERRORS[errorName].RU;
};

export class CustomError extends Error {
  type: ERROR_NAME;
  file: string;
  line: number;

  constructor(
    type: ERROR_NAME,
    {file, line}: {file: string, line: number},
  ) {
    super();
    this.type = type;
    this.file = file;
    this.line = line;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const errorHandler = (res: Response, e: Error) => {
  if (e instanceof CustomError) {
    console.error(
      getTimestamp(),
      "CUSTOM ERROR TYPE >>> ", e.type,
      " >>> FILE and LINE >>> ", e.file, ',', e.line,
    )
    switch (e.type) {
      case ERROR_NAME.INCOMPLETE_INCOMING_DATA:
      case ERROR_NAME.EMAIL_ALREADY_EXISTS:
      case ERROR_NAME.WRONG_CREDENTIALS:
      case ERROR_NAME.WRONG_CLIENT_TYPE:
      case ERROR_NAME.WRONG_PASSWORD:
      case ERROR_NAME.INVALID_PAYLOAD:
      case ERROR_NAME.NO_COOKIES:
      case ERROR_NAME.INVALID_PROFILE_TYPE:
        return res.status(400).send({message: getErrorMessage(e.type)})
      case ERROR_NAME.WRONG_EMAIL:
      case ERROR_NAME.INACTIVE_PROFILE:
      case ERROR_NAME.INVALID_REFRESH_TOKEN:
      case ERROR_NAME.INVALID_ACCESS_TOKEN:
        return res.status(401).send({message: getErrorMessage(e.type)})
      case ERROR_NAME.INTERNAL_SERVER_ERROR:
      case ERROR_NAME.HASHING_ERROR:
        return;
    }
  }
  if (e instanceof MongoError) {
    console.error(getTimestamp(), "MONGO ERROR 500 >>> ", e)
    return res.status(500).send({message: getErrorMessage(ERROR_NAME.INTERNAL_SERVER_ERROR)});
  }
  if (e instanceof JsonWebTokenError) {
    console.error(getTimestamp(), "JSON WEB TOKEN ERROR 500 >>> ", e)
    return res.status(500).send({message: getErrorMessage(ERROR_NAME.INTERNAL_SERVER_ERROR)});
  }
  console.error(getTimestamp(), "INTERNAL SERVER ERROR 500 >>> ", e)
  return res.status(500).send({message: getErrorMessage(ERROR_NAME.INTERNAL_SERVER_ERROR)});
}
