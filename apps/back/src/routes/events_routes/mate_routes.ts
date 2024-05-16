import {Application} from "express";
import {MongoClient, ObjectId} from "mongodb";
import {BreederProfile, DatabaseDog, EVENT_TYPE, KennelProfile, Mate} from "../../types";
import {
  findEntityById, getCookiesPayload,
  insertEntity,
  modifyNestedArrayFieldById,
} from "../../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../../constants";
import {CustomError, ERROR_NAME} from "../../methods/error_messages_methods";

// при добавлении вязки отправляются два запроса: один для суки, один для кобеля

export const initMateRoutes = (app: Application, client: MongoClient) => {
  app.post('/api/mate', async (req, res) => {
    const {profileId} = getCookiesPayload(req)


    const { date, comments, dogId, connectedEvents, partnerId, documentId, activated } = req.body;
    const mateEvent: Mate = {
      profileId: new ObjectId(profileId),
      date,
      comments,
      dogId,
      connectedEvents,
      partnerId,
      documentId,
      eventType: EVENT_TYPE.MATE,
      activated,
    }
    const { insertedId: mateInsertedId } = await insertEntity(client, COLLECTIONS.MATES, mateEvent)
    const partner = await findEntityById<DatabaseDog>(client, COLLECTIONS.DOGS, partnerId)
    if (!partner) throw new CustomError(ERROR_NAME.DATABASE_ERROR)
    await modifyNestedArrayFieldById<DatabaseDog>(client, COLLECTIONS.DOGS, new ObjectId(dogId), mateInsertedId, FIELDS_NAMES.REPRODUCTIVE_HISTORY_MATE_IDS)
    await modifyNestedArrayFieldById<KennelProfile | BreederProfile>(client, COLLECTIONS.PROFILES, new ObjectId(profileId), mateInsertedId, FIELDS_NAMES.EVENT_IDS)
    res.send({ message: 'Вязка добавлена!' })
  })
}
