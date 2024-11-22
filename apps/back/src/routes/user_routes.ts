import {Application, Response} from 'express';
import {MongoClient, ObjectId, WithId} from 'mongodb';
import { createTransport } from 'nodemailer';
import {
  activateProfileByActivator,
  checkIn,
  checkRefreshToken,
  errorHandler,
  findEntitiesByIds,
  findEntityById,
  findUserByEmail,
  findUserById,
  generateAccessToken,
  generateAPIAccessToken,
  generateRefreshToken,
  isPasswordCorrect,
  getTimestamp,
  constructLitterForClient,
  constructDogForClient,
  getCookiesPayload,
  assignValueToField,
  generateRecoveryToken,
  hashPass,
  checkRecoveryToken,
} from "../methods";
import {
  Breed,
  BreederProfile,
  ClientDog,
  DatabaseDog,
  DatabaseProfile,
  KennelProfile,
  DatabaseLitter,
  PROFILE_TYPES,
  User, ClientLitter
} from "../types";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";

// todo организовать безопасную работу с рефреш токенами (хранение в отдельной таблице, проверка)

const URL = process.env.BACKEND_URL || 'http://localhost:8000'

export enum COOKIE_TOKEN_NAMES {
  REFRESH_TOKEN = 'refresh-token',
  API_ACCESS_TOKEN = 'api-access-token'
}

type SetCookiesParams = { res: Response, tokenName: COOKIE_TOKEN_NAMES, token: String }
type UserData = { profileIds: ObjectId[], email: string }
type ProfileDataFields = 'name' | 'type' | 'documentIds' | 'contactIds' | 'eventIds' | 'ownDogIds' | 'litterIds' | 'connectedOrganisations' | 'breedIds'
type ProfilesWithDogs = KennelProfile | BreederProfile
type ProfileData = Pick<ProfilesWithDogs, ProfileDataFields>

// SMTP transporter configuration
const transporter = createTransport({
  service: 'Yandex',
  host: process.env.SMTP_SERVER || 'smtp.yandex.com',
  port: 465,
  secure: true, // true для порта 465, false для других портов
  auth: {
    user: process.env.SMTP_LOGIN || 'login',
    pass: process.env.SMTP_PASSWORD || 'password'
  }
});


const pickUserData = (user: User): UserData => {
  const { profileIds, email } = user;
  return { profileIds, email }
}

const pickProfileData = (profile: KennelProfile | BreederProfile ): ProfileData => {
  const {
    name,
    type,
    documentIds,
    contactIds,
    eventIds,
    ownDogIds,
    litterIds,
    connectedOrganisations,
    breedIds,
  } = profile
  return { name, type, documentIds, contactIds, eventIds, ownDogIds, litterIds, connectedOrganisations, breedIds }
}

export const isProfileHasDogs = (profile: DatabaseProfile): profile is ProfilesWithDogs => {
  return profile.type === PROFILE_TYPES.KENNEL || profile.type === PROFILE_TYPES.BREEDER || profile.type === PROFILE_TYPES.MALE_DOG_OWNER
}

export const setCookie = ({res, tokenName, token}: SetCookiesParams) => {
  res.cookie(tokenName, token, {
    maxAge: 3600 * 1000 * 24 * 30,
    // signed: true, // для этого надо куки парсер поставить
    httpOnly: true,
    secure: false,
    sameSite: false,
    // secure: process.env.NODE_ENV === 'production',
  });
  return res;
}

type GetInitialDataResBody = {
  userData: UserData,
  profileData: ProfileData | null,
  dogs: ClientDog[] | null,
  litters: ClientLitter[] | null,
  events: WithId<Event>[] | null,
  breeds: WithId<Breed>[] | null,
}

export const initUserRoutes = (app: Application, client: MongoClient) => {

  // todo проверку токенов, client.connect() и client.close() перенести в middleware

  // todo рассмотреть вариант, когда сразу после регистрации пользователь попадает в приложение, и оттуда надо подтвердить почту

  app.post('/api/sign-up', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(getTimestamp(), 'REQUEST TO /POST/SIGN-UP, email >>> ', email)
      if (!email || !password) throw new CustomError(ERROR_NAME.INCOMPLETE_INCOMING_DATA, {file: 'user_routes', line: 103})
      const user = await findUserByEmail(client, email);
      if (user) throw new CustomError(ERROR_NAME.EMAIL_ALREADY_EXISTS, {file: 'user_routes', line: 105})
      const checkInResult = await checkIn(client, {email, password});
      // Содержимое письма
      const mailOptions = {
        from: 'vududu_support@vududu.ru',
        to: email,
        subject: 'Подтверждение регистрации',
        text: 'Пожалуйста, подтвердите вашу почту, перейдя по ссылке.',
        html: '<p>Пожалуйста, подтвердите вашу почту, <a href="'+`${URL}/api/activate?activator=${checkInResult.activator}&id=${checkInResult.id}`+'">перейдя по этой ссылке</a>.</p>'
      };

      // Отправка письма
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).send('Mailing error: ' + error.message);
        res.status(200).send({message: 'Письмо для подтверждения отправлено на адрес: ' + email});
      });
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  });

  app.post('/api/password-recovery/init', async (req, res) => {
    try {
      const { email } = req.body;
      console.log(getTimestamp(), 'REQUEST TO /POST/PASSWORD-RECOVERY/INIT, email >>> ', email)
      if (!email) throw new CustomError(ERROR_NAME.INCOMPLETE_INCOMING_DATA, {file: 'user_routes', line: 125})
      const user = await findUserByEmail(client, email);
      if (!user) throw new CustomError(ERROR_NAME.WRONG_EMAIL, {file: 'user_routes', line: 127})
      const recoveryToken = generateRecoveryToken(user._id.toHexString())
      await assignValueToField(client, COLLECTIONS.USERS, user._id, FIELDS_NAMES.PASSWORD_RECOVERY_TOKEN, recoveryToken)
      const mailOptions = {
        from: 'vududu_support@vududu.ru',
        to: email,
        subject: 'Восстановление пароля',
        text: 'Для восстановления пароля перейдите по ссылке',
        html: '<p>Для восстановления пароля <a href="'+`${URL}/api/password-recovery?recoveryToken=${recoveryToken}`+'">перейдите по этой ссылке</a>. Ссылка будет действительна в течении 10 минут</p>'
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).send('Mailing error: ' + error.message);
        res.status(200).send({message: 'Письмо для подтверждения отправлено на адрес: ' + email});
      });
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get<{}, {}, {}, { recoveryToken: string }>('/api/password-recovery', async (req, res) => {
    try {
      console.log(getTimestamp(), 'REQUEST TO /GET/PASSWORD-RECOVERY, CONTINUE >>> ')
      const {recoveryToken} = req.query;
      if (!recoveryToken) throw new CustomError(ERROR_NAME.INCOMPLETE_INCOMING_DATA, {file: 'user_routes', line: 164})
      const {userId} = checkRecoveryToken(recoveryToken)
      if (!userId) throw new CustomError(ERROR_NAME.INVALID_REFRESH_TOKEN, {file: 'user_routes', line: 165})
      const user = await findUserById(client, userId);
      if (!user) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'user_routes', line: 167})
      console.log(getTimestamp(), '>>> CONTINUE FOR /GET/PASSWORD-RECOVERY, email >>> ', user.email, user.passwordRecoveryToken !== recoveryToken)
      if (user.passwordRecoveryToken !== recoveryToken) res.redirect(URL + '/app/sign-in/expired')
      res.redirect(URL + `/app/password-recovery/${recoveryToken}`)
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.post<{}, {}, { password: string, recoveryToken: string }, {}>('/api/password-recovery', async (req, res) => {
    try {
      console.log(getTimestamp(), 'REQUEST TO /POST/PASSWORD-RECOVERY, CONTINUE >>> ')
      const { password, recoveryToken } = req.body;
      if (!recoveryToken || !password) throw new CustomError(ERROR_NAME.INCOMPLETE_INCOMING_DATA, {file: 'user_routes', line: 164})
      const {userId} = checkRecoveryToken(recoveryToken)
      console.log(getTimestamp(), '>>> CONTINUE FOR /POST/PASSWORD-RECOVERY, userId >>> ', userId)
      if (!userId) throw new CustomError(ERROR_NAME.INVALID_REFRESH_TOKEN, {file: 'user_routes', line: 165})
      const hashedPassword = await hashPass(password);
      await assignValueToField(client, COLLECTIONS.USERS, new ObjectId(userId), FIELDS_NAMES.PASSWORD, hashedPassword)
      await assignValueToField(client, COLLECTIONS.USERS, new ObjectId(userId), FIELDS_NAMES.PASSWORD_RECOVERY_TOKEN, null)
      res.status(200).send({message: 'Пароль обновлен'});
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.post('/api/sign-in', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(getTimestamp(), 'REQUEST TO /POST/SIGN-IN, email >>> ', email)
      const user: WithId<User> | null = await findUserByEmail(client, email);
      if (!email || !password) throw new CustomError(ERROR_NAME.WRONG_CREDENTIALS, {file: 'user_routes', line: 132})
      if (!user) throw new CustomError(ERROR_NAME.WRONG_EMAIL, {file: 'user_routes', line: 133})
      if (!user.isActivated) throw new CustomError(ERROR_NAME.INACTIVE_PROFILE, {file: 'user_routes', line: 134})
      const correctPassword = await isPasswordCorrect(user, password)
      if (!correctPassword) throw new CustomError(ERROR_NAME.WRONG_PASSWORD, {file: 'user_routes', line: 136})
      if (!user._id) throw new CustomError(ERROR_NAME.INTERNAL_SERVER_ERROR, {file: 'user_routes', line: 137})
      const profileId = user.activeProfileId instanceof ObjectId ? user.activeProfileId.toHexString() : user.activeProfileId
      const accessToken = generateAccessToken(profileId)
      const apiAccessToken = generateAPIAccessToken(user._id.toHexString(), profileId)
      const refreshToken = generateRefreshToken(user._id.toHexString())
      setCookie({res, tokenName: COOKIE_TOKEN_NAMES.REFRESH_TOKEN, token: refreshToken})
      setCookie({res, tokenName: COOKIE_TOKEN_NAMES.API_ACCESS_TOKEN, token: apiAccessToken})
        .send({ accessToken });
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.post('/api/sign-out', async (req, res) => {
    console.log(getTimestamp(), 'REQUEST TO /POST/SIGN-OUT')
    try {
      res.clearCookie(COOKIE_TOKEN_NAMES.REFRESH_TOKEN);
      res.clearCookie(COOKIE_TOKEN_NAMES.API_ACCESS_TOKEN);
      res.send();
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get<{}, { message: string }, {}, { id: string; activator: string }>('/api/activate', async (req, res) => {
    try {
      const {id, activator} = req.query
      console.log(getTimestamp(), 'REQUEST TO /GET/ACTIVATE, id >>> ', id)
      await activateProfileByActivator(client, id, activator)
      res.redirect(URL + '/app/sign-in?activated')
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get('/api/user', async (req, res) => {
    try {
      const {userId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/USER, userId >>> ', userId)
      const user: WithId<User> | null = await findUserById(client, userId)
      if (!user) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'user_routes', line: 177})
      let userData = pickUserData(user)
      return res.send(userData)
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get<{}, GetInitialDataResBody, {}, {}>('/api/initial-data', async(req, res) => {
    try {
      const {userId, profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/INITIAL-DATA, userId >>> ', userId, ' >>> profileId >>> ', profileId)
      const user: WithId<User> | null = await findUserById(client, userId)
      if (!user) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'user_routes', line: 190})
      const userData = pickUserData(user)
      if (!profileId) return res.send({userData, profileData: null, dogs: null, litters: null, events: null, breeds: null})
      const profile: WithId<DatabaseProfile> | null = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId))
      if (!profile) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'user_routes', line: 200})
      if (!isProfileHasDogs(profile)) throw new CustomError(ERROR_NAME.INVALID_PROFILE_TYPE, {file: 'user_routes', line: 201})
      const profileData = pickProfileData(profile)
      const rawDogsData: WithId<DatabaseDog>[] = await findEntitiesByIds<DatabaseDog>(client, COLLECTIONS.DOGS, profileData.ownDogIds)

      const dogs: ClientDog[] = await Promise.all(
        rawDogsData.map((rawDogData) => constructDogForClient(client, rawDogData))
      )

      const breeds: WithId<Breed>[] = await findEntitiesByIds<Breed>(client, COLLECTIONS.BREEDS, profileData.breedIds)

      const rawLittersData: WithId<DatabaseLitter>[] = await findEntitiesByIds<DatabaseLitter>(client, COLLECTIONS.LITTERS, profileData.litterIds)

      const litters: ClientLitter[] = await Promise.all(
        rawLittersData.map((rawLitterData) => constructLitterForClient(client, rawLitterData)))

      const events: WithId<Event>[] = await findEntitiesByIds<Event>(client, COLLECTIONS.EVENTS, profileData.eventIds)

      return res.send({userData, profileData, dogs, litters, events, breeds})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.post('/api/refresh-token', async (req, res) => {
    console.log(getTimestamp(), 'REQUEST TO /POST/REFRESH-TOKEN')
    try {
      if (!req.cookies) throw new CustomError(ERROR_NAME.NO_COOKIES, {file: 'user_routes', line: 235})
      const refreshToken = req.cookies[COOKIE_TOKEN_NAMES.REFRESH_TOKEN];
      if (!refreshToken) throw new CustomError(ERROR_NAME.INVALID_PAYLOAD, {file: 'user_routes', line: 237})
      const {userId} = checkRefreshToken(refreshToken)
      if (!userId) throw new CustomError(ERROR_NAME.INVALID_REFRESH_TOKEN, {file: 'user_routes', line: 239})
      console.log(getTimestamp(), '/api/refresh-token >>> userId >>> ', userId)
      const user = await findUserById(client, userId)
      if (!user) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'user_routes', line: 241})
      const profileId = user.activeProfileId instanceof ObjectId ? user.activeProfileId.toHexString() : user.activeProfileId
      const accessToken = generateAccessToken(profileId)
      const apiAccessToken = generateAPIAccessToken(user._id.toHexString(), profileId)
      const newRefreshToken = generateRefreshToken(user._id.toHexString())
      setCookie({res, tokenName: COOKIE_TOKEN_NAMES.REFRESH_TOKEN, token: newRefreshToken})
      setCookie({res, tokenName: COOKIE_TOKEN_NAMES.API_ACCESS_TOKEN, token: apiAccessToken})
        .send({ accessToken });
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  });
}
