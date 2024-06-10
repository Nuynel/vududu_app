import {Application} from "express";
import {MongoClient, ObjectId} from "mongodb";
import {Breed, BreedIssue} from "../types";
import {
  assignIdToField,
  assignValueToField,
  errorHandler,
  findEntitiesByObjectIds,
  findEntitiesBySearchString,
  findEntityById,
  findUserById,
  getAllDocuments,
  getCookiesPayload,
  getTimestamp,
  insertEntity
} from "../methods";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";
import {BREED_STATUSES} from "../types/breed";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";

export const initBreedRoutes = (app: Application, client: MongoClient) => {
  app.post<{}, {}, {name: {rus: string, eng: string} , breedDescription: string}, {}>('/api/breed', async (req, res) => {
    try {
      const {userId, profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /POST/BREED, userId >>> ', userId)

      const { name, breedDescription } = req.body

      const user = await findUserById(client, userId)

      if (!user) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'breed_routes', line: 40})

      const newDatabaseBreed: Breed = {
        name,
        group: null,
        organisations: [],
        status: BREED_STATUSES.MODERATED,
        issueId: null,
        standard: null,
        images: null,
      }

      const { insertedId: breedId } = await insertEntity(client, COLLECTIONS.BREEDS, newDatabaseBreed)

      const newBreedIssue: BreedIssue = {
        status: BREED_STATUSES.MODERATED,
        breedId,
        breedDescription,
        comment: null,
        profileId: new ObjectId(profileId),
        email: user.email
      }

      const { insertedId: breedIssueId } = await insertEntity(client, COLLECTIONS.BREED_ISSUES, newBreedIssue)

      await assignIdToField(client, COLLECTIONS.BREEDS, breedId, FIELDS_NAMES.BREED_ISSUE_ID, breedIssueId)

      res.status(200).send({message: 'Порода добавлена в список модерации'})

    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get('/api/breed-issues', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /GET/BREED-ISSUES, userId >>> ', profileId)
      const breedIssues = await findEntitiesByObjectIds(client, COLLECTIONS.BREED_ISSUES, [new ObjectId(profileId)], FIELDS_NAMES.PROFILE_ID)

      res.status(200).send({breedIssues})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get<{}, {}, {}, { issueId: string, status: BREED_STATUSES }>('/api/moderate-breed-issue', async (req, res) => {
    try {
      const {issueId, status} = req.query;
      console.log(getTimestamp(), 'REQUEST TO /GET/MODERATE-BREED-ISSUE, issueId >>> ', issueId)
      if (!issueId || !Object.values(BREED_STATUSES).includes(status)) throw new CustomError(ERROR_NAME.INCOMPLETE_INCOMING_DATA, {file: 'breed_routes', line: 78})

      const breedIssue = await findEntityById(client, COLLECTIONS.BREED_ISSUES, new ObjectId(issueId))

      if (!breedIssue) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'breed_routes', line: 84})

      const { breedId } = breedIssue;

      await assignValueToField(client, COLLECTIONS.BREED_ISSUES, new ObjectId(issueId), FIELDS_NAMES.BREED_STATUS, status)
      await assignValueToField(client, COLLECTIONS.BREEDS, breedId, FIELDS_NAMES.BREED_STATUS, status)

      res.status(200).send({message: `Статус породы обновлен, новый статус: ${status}`})

    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  app.get<{}, { breeds: Breed[] }, {}, { searchString: string }>('/api/breeds', async (req, res) => {
    try {
      const {userId, profileId} = getCookiesPayload(req);
      console.log(getTimestamp(), 'REQUEST TO /GET/BREEDS with searchString, userId >>> ', userId, ' >>> profileId >>> ', profileId)
      const { searchString } = req.query;

      const rawBreedsData = searchString
        ? await findEntitiesBySearchString<Breed>(client, COLLECTIONS.BREEDS, FIELDS_NAMES.BREED_NAME_RUS, searchString)
        : await getAllDocuments<Breed>(client, COLLECTIONS.BREEDS)
      const profileBreedsIssues = await findEntitiesByObjectIds<BreedIssue>(client, COLLECTIONS.BREED_ISSUES, [new ObjectId(profileId)], FIELDS_NAMES.PROFILE_ID)

      const issueIds = profileBreedsIssues.map(breedIssue => breedIssue._id.toHexString())

      const breeds = rawBreedsData.filter((breed) => (
        breed.status === BREED_STATUSES.APPROVED || (
            breed.status === BREED_STATUSES.MODERATED
            && breed.issueId
            && issueIds.includes(breed.issueId.toHexString())
        ))
      )

      res.status(200).send({breeds})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })
}
