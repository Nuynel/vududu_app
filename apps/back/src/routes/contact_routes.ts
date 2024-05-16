import {Application} from "express";
import {MongoClient} from "mongodb";
import {Contact} from "../types";
import {insertEntity, modifyNestedArrayFieldById} from "../methods";
import {COLLECTIONS, FIELDS_NAMES} from "../constants";


export const initContactRoutes = (app: Application, client: MongoClient) => {
  app.post('/api/contact', async (req, res) => {
    const {profileId, name, phoneNumber, telegramUsername, email, notes, type} = req.body
    const contact: Contact = {profileId, name, phoneNumber, telegramUsername, email, notes, type}
    const { insertedId: contactId } = await insertEntity(client, COLLECTIONS.CONTACTS, contact)
    await modifyNestedArrayFieldById(client, COLLECTIONS.PROFILES, profileId, contactId, FIELDS_NAMES.CONTACT_IDS)
    res.send({ message: 'Контакт добавлен!' })
  });
}
