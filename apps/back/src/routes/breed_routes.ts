import {Application} from "express";
import {MongoClient, ObjectId} from "mongodb";
import {Breed, BreedIssue} from "../types";
import {
  assignIdToField,
  assignValueToField,
  errorHandler,
  findEntitiesByObjectIds,
  findEntityById,
  findUserById,
  getCookiesPayload,
  getTimestamp,
  insertEntity
} from "../methods";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";
import {BREED_STATUSES} from "../types/breed";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";

export const initBreedRoutes = (app: Application, client: MongoClient) => {
  app.post<{}, {}, {newBreed: Pick<Breed, 'name'> & Pick<BreedIssue, 'breedDescription'>}, {}>('/api/breed', async (req, res) => {
    try {
      const {userId, profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /POST/BREED, userId >>> ', userId)

      const { newBreed } = req.body

      const user = await findUserById(client, userId)

      if (!user) throw new CustomError(ERROR_NAME.DATABASE_ERROR, {file: 'breed_routes', line: 40})

      const newDatabaseBreed: Breed = {
        name: newBreed.name,
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
        breedDescription: newBreed.breedDescription,
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
}
