import {Application} from "express";
import {MongoClient} from "mongodb";
import {BreederProfile, EVENT_TYPE, KennelProfile, DatabaseLitter, Registration} from "../../types";
import {insertEntity, assignIdToField, modifyNestedArrayFieldById} from "../../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../../constants";

export const initRegistrationRoutes = (app: Application, client: MongoClient) => {
  app.post('/api/registration', async (req, res) => {
    const { profileId, date, comments, dogId, connectedEvents, litterId, documentId, activated } = req.body;
    const registrationEvent: Registration = { profileId, date, comments, dogId, connectedEvents, litterId, documentId, eventType: EVENT_TYPE.REGISTRATION, activated }
    const { insertedId: registrationInsertedId } = await insertEntity(client, COLLECTIONS.REGISTRATIONS, registrationEvent)
    await assignIdToField<DatabaseLitter>(client, COLLECTIONS.LITTERS, litterId, FIELDS_NAMES.REGISTRATION_ID, registrationInsertedId)
    await modifyNestedArrayFieldById<KennelProfile | BreederProfile>(client, COLLECTIONS.PROFILES, profileId, registrationInsertedId, FIELDS_NAMES.EVENT_IDS)
    res.send({ message: 'Актировка добавлена!' })
  })
}

// как работает добавление актировки?

// к моменту проведения актировки у всех щенков уже заведены карточки, их надо заводить при рождении
// когда проводится актировка - добавляется карточка актировки, присвоенная помету
