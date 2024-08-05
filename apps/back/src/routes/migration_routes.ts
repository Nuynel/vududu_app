import {Application, Request, Response, NextFunction} from "express";
import {MongoClient} from "mongodb";
import {processMigrations} from "../integrations/runMigrations";
import {getTimestamp} from "../methods";

const username = process.env.MONGO_EXPRESS_USERNAME || 'metacerkar!y';
const password = process.env.MONGO_EXPRESS_PASSWORD || 'plumb0l0g0l0v';

const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Authentication required.');
  }

  const encodedCredentials = authHeader.split(' ')[1];
  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
  const [reqUsername, reqPassword] = decodedCredentials.split(':');

  if (reqUsername === username && reqPassword === password) {
    return next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Invalid credentials.');
  }
};


export const initMigrationRoutes = (app: Application, client: MongoClient) => {
  app.get<{}, {}, {}, {}>('/api/migration/up', basicAuth, async (req, res) => {
    console.log(getTimestamp(), 'REQUEST TO GET/MIGRATION')
    try {
      const result = await processMigrations(client);
      res.send(result);
    } catch (error) {
      if (error instanceof Error) res.status(500).send('Ошибка: ' + error.message);
    }
  })
}
