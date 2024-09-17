import {Application} from "express";
import {MongoClient, ObjectId} from "mongodb";
import {
  errorHandler,
  findEntityById,
  getCookiesPayload,
  getPermissionsSample,
  getTimestamp,
  insertEntity, modifyNestedArrayFieldById
} from "../methods";
import {DatabaseDocument, DatabaseProfile} from "../types";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";
import {CustomError, ERROR_NAME} from "../methods/error_messages_methods";

export const initDocumentRoutes = (app: Application, client: MongoClient) => {
  app.post<{}, {}, Omit<DatabaseDocument, 'profileId' | 'link' | 'permissions'>, {}>('/api/document', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      console.log(getTimestamp(), 'REQUEST TO /POST/DOCUMENT, profileId >>> ', profileId)
      const newDocument: DatabaseDocument = {
        ...req.body,
        profileId: new ObjectId(profileId),
        link: null,
        permissions: getPermissionsSample(),
      }

      const { insertedId: documentId } = await insertEntity(client, COLLECTIONS.DOCUMENTS, newDocument);

      await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, new ObjectId(profileId), documentId, FIELDS_NAMES.DOCUMENT_IDS);

      if (req.body.dogIds?.length) await Promise.all(req.body.dogIds.map((dogId) =>
        modifyNestedArrayFieldById(client, COLLECTIONS.DOGS, new ObjectId(dogId), documentId, FIELDS_NAMES.DOCUMENT_IDS))
      )

      if (req.body.litterId) await modifyNestedArrayFieldById(client, COLLECTIONS.LITTERS, new ObjectId(req.body.litterId), documentId, FIELDS_NAMES.DOCUMENT_IDS)
      if (req.body.eventId) await modifyNestedArrayFieldById(client, COLLECTIONS.EVENTS, new ObjectId(req.body.eventId), documentId, FIELDS_NAMES.DOCUMENT_IDS)

      res.send({ message: 'Документ добавлен!', document})
    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  })

  // app.
}
