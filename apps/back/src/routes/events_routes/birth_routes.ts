// import {Application} from "express";
// import {MongoClient} from "mongodb";
// import {Birth, BreederProfile, EVENT_TYPE, KennelProfile} from "../../types";
// import {
//   insertEntity,
//   modifyNestedArrayFieldById,
// } from "../../methods";
// import {COLLECTIONS, FIELDS_NAMES} from "../../constants";
//
// export const initBirthRoutes = (app: Application, client: MongoClient) => {
//   app.post('/api/birth', async (req, res) => {
//     const { profileId, date, comments, dogId, connectedEvents, litterId, activated } = req.body;
//     const birth: Birth = { profileId, date, comments, dogId, connectedEvents, litterId, eventType: EVENT_TYPE.BIRTH, activated }
//     const { insertedId: birthInsertedId } = await insertEntity(client, COLLECTIONS.BIRTHS, birth)
//     await modifyNestedArrayFieldById<KennelProfile | BreederProfile>(client, COLLECTIONS.PROFILES, profileId, birthInsertedId, FIELDS_NAMES.EVENT_IDS)
//     res.send({ message: 'Роды добавлены!' })
//   })
// }
