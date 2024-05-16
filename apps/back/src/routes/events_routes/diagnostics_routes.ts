import {Application} from "express";
import {MongoClient} from "mongodb";
import {
  BreederProfile,
  DatabaseDog,
  DatabaseProfile,
  Diagnostics,
  EVENT_TYPE,
  History,
  KennelProfile
} from "../../types";
import {
  findOneField,
  insertEntity,
  assignValueToField,
  modifyNestedArrayFieldById,
  // modifyNestedHistoryArrayFieldById
} from "../../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../../constants";

export const initDiagnosticsRoutes = (app: Application, client: MongoClient) => {
  app.post('/api/diagnostics', async (req, res) => {
    const { profileId, date, comments, dogId, documentId, diagnosticsType, vet, activated } = req.body
    const diagnostics: Diagnostics = { profileId, date, comments, dogId, documentId, diagnosticsType, vet, eventType: EVENT_TYPE.DIAGNOSTICS, activated }
    const { insertedId: diagnosticsInsertedId } = await insertEntity(client, COLLECTIONS.DIAGNOSTICS, diagnostics)
    // await modifyNestedHistoryArrayFieldById<DatabaseDog>(client, COLLECTIONS.DOGS, dogId, {
    //   title: `${date} => ${diagnosticsType}`,
    //   id: diagnosticsInsertedId
    // }, FIELDS_NAMES.DIAGNOSTIC_IDS)
    await modifyNestedArrayFieldById<KennelProfile | BreederProfile>(client, COLLECTIONS.PROFILES, profileId, diagnosticsInsertedId, FIELDS_NAMES.EVENT_IDS)
    res.send({ message: 'Диагностическое исследование добавлено!' })
  })
}

// ToDo: фото документа приходит на сервер, обрабатывается, отсылается в хранилище, ссылка кладется в бд, результат отправляетс пользователю

// ToDo: картинок может быть несколько (до 10 в 1 запросе), надо потом сделать обработку нескольких картинок

// ToDo: сделать адекватное сжатие картинки для последующего хранения

// ToDo: сделать редактирование документа

// ToDo: сделать удаление документа

// ToDo: переделать добавление документа в историю если история диагностики для собаки уже есть, то её надо просто обновить, а не создавать заново
