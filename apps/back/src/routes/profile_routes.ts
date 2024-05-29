import {Application} from "express";
import {MongoClient, ObjectId, WithId} from "mongodb";
import {CustomError, ERROR_NAME, errorHandler} from "../methods/error_messages_methods";
import {
  assignValueToField,
  checkAPIAccessToken,
  findEntityById, generateAccessToken, generateAPIAccessToken, generateRefreshToken,
  insertEntity,
  modifyNestedArrayFieldById,
  getTimestamp,
  getCookiesPayload,
} from "../methods";
import {BreederProfile, DatabaseProfile, KennelProfile, MaleDogOwnerProfile, PROFILE_TYPES} from "../types";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {COOKIE_TOKEN_NAMES, setCookie} from "./user_routes";

type ProfileDataFields = 'name' | 'documentIds' | 'contactIds' | 'eventIds' | 'dogIds'
type ProfilesWithDogs = KennelProfile | BreederProfile | MaleDogOwnerProfile
type ProfileData = Pick<ProfilesWithDogs, ProfileDataFields>

export function isKennelOrBreedProfile(profile: DatabaseProfile): profile is KennelProfile | BreederProfile {
  return profile.type === PROFILE_TYPES.KENNEL || profile.type === PROFILE_TYPES.BREEDER;
}

const pickProfileData = (profile: KennelProfile | BreederProfile | MaleDogOwnerProfile): ProfileData => {
  const { name, documentIds, contactIds, eventIds, dogIds} = profile
  return { name, documentIds, contactIds, eventIds, dogIds }
}

export const initProfileRoutes = (app: Application, client: MongoClient) => {
  app.post('/api/profile', async (req, res) => {
    try {
      const {userId} = getCookiesPayload(req, false);
      console.log(getTimestamp, 'REQUEST TO /POST/PROFILE, userId >>> ', userId)

      const { name, type, connectedOrganisations } = req.body;

      // const profile: DatabaseProfile = createNewDatabaseProfile(userId, name, type, connectedOrganisations)
      const profile: DatabaseProfile = {
        userId: new ObjectId(userId),
        name,
        type,
        connectedOrganisations,
        payments: {},
        permissions: {},
        documentIds: [],
        contactIds: [],
        eventIds: [],
        dogIds: [],
      }

      if (isKennelOrBreedProfile(profile)) {
        const specificProfile = profile as KennelProfile | BreederProfile;
        specificProfile.litterIds = []
        const { insertedId: profileId } = await insertEntity(client, COLLECTIONS.PROFILES, profile)
        if (!profileId) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'profile_routes', line: 56})
        await modifyNestedArrayFieldById(client, COLLECTIONS.USERS, new ObjectId(userId), profileId, FIELDS_NAMES.PROFILES_IDS)
        await assignValueToField(client, COLLECTIONS.USERS, new ObjectId(userId), FIELDS_NAMES.ACTIVE_PROFILE_ID, profileId)
        const accessToken = generateAccessToken(profileId.toHexString())
        const apiAccessToken = generateAPIAccessToken(userId, profileId.toHexString())
        const refreshToken = generateRefreshToken(userId)
        setCookie({res, tokenName: COOKIE_TOKEN_NAMES.REFRESH_TOKEN, token: refreshToken})
        setCookie({res, tokenName: COOKIE_TOKEN_NAMES.API_ACCESS_TOKEN, token: apiAccessToken})
          .send({ accessToken, message: 'профиль добавлен!' });
      } else {
        res.status(400).send(`Профиль НЕ добавлен, так как это не профиль питомника или заводчика!`)
      }
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  });

  app.get('/api/profile', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req);
      console.log(getTimestamp, 'REQUEST TO /GET/PROFILE, profileId >>> ', profileId)
      const profile = await findEntityById<DatabaseProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId))
      if (!profile) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'profile_routes', line: 78})
      if (!isKennelOrBreedProfile(profile)) throw new CustomError(ERROR_NAME.INVALID_PROFILE_TYPE, {file: 'profile_routes', line: 79})
      let profileData = pickProfileData(profile)
      return res.send({profileData})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })
}
