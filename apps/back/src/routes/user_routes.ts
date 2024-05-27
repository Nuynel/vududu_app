import {Application, raw, Response} from 'express';
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
  getCookiesPayload
} from "../methods";
import {BreederProfile, DatabaseDog, DatabaseProfile, KennelProfile, Litter, PROFILE_TYPES, User} from "../types";
import {COLLECTIONS} from "../constants";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";

// todo организовать безопасную работу с рефреш токенами (хранение в отдельной таблице, проверка)

const URL = process.env.BACKEND_URL || 'http://localhost:8000'

export enum COOKIE_TOKEN_NAMES {
  REFRESH_TOKEN = 'refresh-token',
  API_ACCESS_TOKEN = 'api-access-token'
}

type SetCookiesParams = { res: Response, tokenName: COOKIE_TOKEN_NAMES, token: String }
type UserData = { profileIds: ObjectId[], email: string }
type ProfileDataFields = 'name' | 'type' | 'documentIds' | 'contactIds' | 'eventIds' | 'dogIds' | 'litterIds' | 'connectedOrganisations'
type ProfilesWithDogs = KennelProfile | BreederProfile
type ProfileData = Pick<ProfilesWithDogs, ProfileDataFields>

// SMTP transporter configuration
const transporter = createTransport({
  service: 'Brevo',
  host: process.env.SMTP_SERVER || 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true для порта 465, false для других портов
  auth: {
    user: process.env.SMTP_LOGIN || 'your@brevo-email.com',
    pass: process.env.SMTP_PASSWORD || 'your-brevo-password'
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
    dogIds,
    litterIds,
    connectedOrganisations} = profile
  return { name, type, documentIds, contactIds, eventIds, dogIds, litterIds, connectedOrganisations }
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

export const initUserRoutes = (app: Application, client: MongoClient) => {

  // todo http переделать на https

  // todo проверку токенов, client.connect() и client.close() перенести в middleware

  // todo убрать отовсюду clientType и переписать методы так,
  //  чтобы токен доступа отправлялся в теле запроса, а рефреш токен в куках

  // todo рассмотреть вариант, когда сразу после регистрации пользователь попадает в приложение, и оттуда надо подтвердить почту

  app.post('/api/sign-up', async (req, res) => {
    console.log(getTimestamp, 'REQUEST TO /POST/SIGN-UP')
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new CustomError(ERROR_NAME.INCOMPLETE_INCOMING_DATA)
      const user = await findUserByEmail(client, email);
      if (user) throw new CustomError(ERROR_NAME.EMAIL_ALREADY_EXISTS)
      const checkInResult = await checkIn(client, {email, password});
      // Содержимое письма
      const mailOptions = {
        from: 'snezhinka.alisa@gmail.com',
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

  app.post('/api/sign-in', async (req, res) => {
    console.log(getTimestamp, 'REQUEST TO /POST/SIGN-IN')
    try {
      const { email, password } = req.body;
      console.log({email})
      const user: WithId<User> | null = await findUserByEmail(client, email);
      if (!email || !password) throw new CustomError(ERROR_NAME.WRONG_CREDENTIALS)
      if (!user) throw new CustomError(ERROR_NAME.WRONG_EMAIL)
      if (!user.isActivated) throw new CustomError(ERROR_NAME.INACTIVE_PROFILE)
      const correctPassword = await isPasswordCorrect(user, password)
      if (!correctPassword) throw new CustomError(ERROR_NAME.WRONG_PASSWORD)
      if (!user._id) throw new CustomError(ERROR_NAME.INTERNAL_SERVER_ERROR)
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
    console.log(getTimestamp, 'REQUEST TO /POST/SIGN-OUT')
    try {
      res.clearCookie(COOKIE_TOKEN_NAMES.REFRESH_TOKEN);
      res.clearCookie(COOKIE_TOKEN_NAMES.API_ACCESS_TOKEN);
      res.send();
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get<{}, { message: string }, {}, { id: string; activator: string }>('/api/activate', async (req, res) => {
    console.log(getTimestamp, 'REQUEST TO /GET/ACTIVATE')
    try {
      const {id, activator} = req.query
      await activateProfileByActivator(client, id, activator)
      res.status(200).send({message: 'Профиль активирован'}); // Перекидывать на страницу с успешным подтверждением почты
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get('/api/user', async (req, res) => {
    console.log(getTimestamp, 'REQUEST TO /GET/USER')
    try {
      const {userId} = getCookiesPayload(req);
      const user: WithId<User> | null = await findUserById(client, userId)
      if (!user) throw new CustomError(ERROR_NAME.DATABASE_ERROR)
      let userData = pickUserData(user)
      return res.send(userData)
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get('/api/initial-data', async(req, res) => {
    console.log(getTimestamp, 'REQUEST TO /GET/INITIAL-DATA')
    try {
      const {userId, profileId} = getCookiesPayload(req);
      const user: WithId<User> | null = await findUserById(client, userId)
      if (!user) throw new CustomError(ERROR_NAME.DATABASE_ERROR)
      const userData = pickUserData(user)
      if (
        !profileId
        || typeof profileId !== 'string'
        // || !userData.profileIds.includes(new ObjectId(profileId))
      ) return res.send({userData})
      // надо получить необходимые данные пользователя, данные текущего профиля,
      // данные о собаках, данные о событиях, данные о документах, данные о контактах
      const profile: WithId<DatabaseProfile> | null = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId))
      if (!profile) throw new CustomError(ERROR_NAME.DATABASE_ERROR)
      if (!isProfileHasDogs(profile)) throw new CustomError(ERROR_NAME.INVALID_PROFILE_TYPE)
      const profileData = pickProfileData(profile)
      const rawDogsData: WithId<DatabaseDog>[] = await findEntitiesByIds<DatabaseDog>(client, COLLECTIONS.DOGS, profileData.dogIds)

      const dogs = await Promise.all(
        rawDogsData.map((rawDogData) => constructDogForClient(client, rawDogData))
      )

      const rawLittersData: WithId<Litter>[] = await findEntitiesByIds<Litter>(client, COLLECTIONS.LITTERS, profileData.litterIds)

      const litters = await Promise.all(
        rawLittersData.map((rawLitterData) => constructLitterForClient(client, rawLitterData)))

      const events: WithId<Event>[] = await findEntitiesByIds<Event>(client, COLLECTIONS.EVENTS, profileData.eventIds)

      return res.send({userData, profileData, dogs, litters, events})
      // пока что разрабатываем получение начальных данных для питомников и заводчиков, другие кейсы не покрываем
      // const dogList =
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.put('/api/user', async (req, res) => {

  })

  app.delete('/api/user', async (req, res) => {

  });

  app.post('/api/refresh-token', async (req, res) => {
    console.log(getTimestamp, 'REQUEST TO /POST/REFRESH-TOKEN')
    try {
      if (!req.cookies) throw new CustomError(ERROR_NAME.NO_COOKIES)
      const refreshToken = req.cookies[COOKIE_TOKEN_NAMES.REFRESH_TOKEN];
      if (!refreshToken) throw new CustomError(ERROR_NAME.INVALID_PAYLOAD)
      const {userId} = checkRefreshToken(refreshToken)
      if (!userId) throw new CustomError(ERROR_NAME.INVALID_REFRESH_TOKEN)
      const user = await findUserById(client, userId)
      if (!user) throw new CustomError(ERROR_NAME.DATABASE_ERROR)
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
