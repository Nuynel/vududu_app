import {Request} from 'express'
import {COOKIE_TOKEN_NAMES} from "../routes/user_routes";
import {CustomError, ERROR_NAME} from "./error_messages_methods";
import {checkAPIAccessToken} from "./jwt_methods";

export const getCookiesPayload = (req: Request, checkProfile = true): { profileId: string, userId: string } => {
  const apiAccessToken = req.cookies[COOKIE_TOKEN_NAMES.API_ACCESS_TOKEN];
  if (!apiAccessToken) throw new CustomError(ERROR_NAME.INVALID_PAYLOAD, {file: 'validation_methods', line: 8})
  if (typeof apiAccessToken !== 'string') throw new CustomError(ERROR_NAME.INVALID_ACCESS_TOKEN, {file: 'validation_methods', line: 9})
  const {userId, profileId} = checkAPIAccessToken(apiAccessToken);
  if (!userId) throw new CustomError(ERROR_NAME.INVALID_ACCESS_TOKEN, {file: 'validation_methods', line: 11});
  if (!checkProfile) return { userId, profileId: '' }
  if (!profileId) throw new CustomError(ERROR_NAME.INVALID_ACCESS_TOKEN, {file: 'validation_methods', line:13});
  return { userId, profileId }

}
