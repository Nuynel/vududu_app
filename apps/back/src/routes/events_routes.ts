import {Application} from "express";
import {MongoClient, ObjectId} from "mongodb";
import {
  errorHandler,
  getCookiesPayload,
  deleteEvent,
  verifyProfileType
} from "../methods";

// при массовом редактировании открывается попап где можно выбрать дату и нажать кнопку активировать
// при удалении открывается попап подтверждения (Хотите ли удалить этих животных / эти пометы / эти события...)

// к собаке могут быть привязаны события, документы, пометы
// собак можно удалять только по одной

// при удалении помета он удаляется из записей родителей и из записей щенков, так же в будущем удалять из записей документов
// при удалении события оно удаляется из записей собак и профиля

// массовое только удаление событий
// удаление собак и пометов только по одному

export const initEventRoutes = (app: Application, client: MongoClient) => {
  app.delete('/api/events', async (req, res) => {
    try {
      const {profileId} = getCookiesPayload(req)
      await verifyProfileType(client, profileId)

      const { eventsIds }: {eventsIds: string[]} = req.body
      await Promise.all(eventsIds.map((eventId) => deleteEvent(new ObjectId(eventId), client)))

      res.send({ message: 'События удалены!' })

    } catch (e) {
      if (e instanceof Error) errorHandler(res, e)
    }
  });
}
