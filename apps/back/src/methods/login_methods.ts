import {NewUser, User} from "../types";
import bcrypt from "bcryptjs";
import {MongoClient} from "mongodb";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {ERROR_NAME, CustomError} from "./error_messages_methods";
import {insertEntity, assignValueToField} from "./db_methods";
import {generateActivatorToken, checkActivatorToken} from './jwt_methods'

export const hashPass = async (password: string) => {
  try {
    return await bcrypt.hash(password, 12)
  } catch (e) {
    throw new CustomError(ERROR_NAME.HASHING_ERROR, {file: 'login_methods', line: 12})
  }
};

export const isPasswordCorrect = async (user: User, password: string) => {
  try {
    return await bcrypt.compare( password, user.password )
  } catch (e) {
    throw new CustomError(ERROR_NAME.HASHING_ERROR, {file: 'login_methods', line: 20})
  }
}

export const checkIn = async (client: MongoClient, {email, password}: NewUser): Promise<string> => {
  const hashedPassword = await hashPass(password);
  const user: User = {
    email,
    password: hashedPassword,
    activator: null,
    isActivated: false,
    isBanned: false,
    createdAt: (new Date()).toISOString(),
    profileIds: [],
    activeProfileId: null,
  };

  const { insertedId } = await insertEntity(client, COLLECTIONS.USERS, user);
  const activator = generateActivatorToken(insertedId.toHexString());
  await assignValueToField(client, COLLECTIONS.USERS, insertedId, FIELDS_NAMES.ACTIVATOR, activator)

  return activator
};
