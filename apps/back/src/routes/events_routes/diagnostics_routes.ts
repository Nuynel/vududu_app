import {Application} from "express";
import {MongoClient, ObjectId} from "mongodb";
import {BreederProfile, DatabaseDogEvent, EVENT_TYPE, KennelProfile, RawDiagnosticsData} from "../../types";
import {insertEntity, modifyNestedArrayFieldById,} from "../../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../../constants";

export const initDiagnosticsRoutes = (app: Application, client: MongoClient) => {
  app.post<{}, { message: string }, RawDiagnosticsData, {}>('/api/diagnostics', async (req, res) => {
    const diagnostics: DatabaseDogEvent = {
      ...req.body,
      eventType: EVENT_TYPE.DIAGNOSTICS,
      validity: null,
      medication: null,
      partnerId: null,
      litterId: null,
      profileId: new ObjectId(req.body.profileId),
      dogId: new ObjectId(req.body.dogId),
      documentId: new ObjectId(req.body.documentId), // todo создние события и документа в одном запросе. ??в типе поменять documentId string => string | null??
    }
    const { insertedId: diagnosticsInsertedId } = await insertEntity(client, COLLECTIONS.DIAGNOSTICS, diagnostics)
    // await modifyNestedHistoryArrayFieldById<DatabaseDog>(client, COLLECTIONS.DOGS, dogId, {
    //   title: `${date} => ${diagnosticsType}`,
    //   id: diagnosticsInsertedId
    // }, FIELDS_NAMES.DIAGNOSTIC_IDS)
    await modifyNestedArrayFieldById<KennelProfile | BreederProfile>(client, COLLECTIONS.PROFILES, new ObjectId(req.body.profileId), diagnosticsInsertedId, FIELDS_NAMES.EVENT_IDS)
    res.send({ message: 'Диагностическое исследование добавлено!' })
  })
}

// ToDo: фото документа приходит на сервер, обрабатывается, отсылается в хранилище, ссылка кладется в бд, результат отправляетс пользователю

// ToDo: картинок может быть несколько (до 10 в 1 запросе), надо потом сделать обработку нескольких картинок

// ToDo: сделать адекватное сжатие картинки для последующего хранения

// ToDo: сделать редактирование документа

// ToDo: сделать удаление документа

// ToDo: переделать добавление документа в историю если история диагностики для собаки уже есть, то её надо просто обновить, а не создавать заново
