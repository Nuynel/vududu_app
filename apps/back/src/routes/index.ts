import { MongoClient } from 'mongodb';
import { Application } from 'express';
import { initUserRoutes } from './user_routes';
import { initDogRoutes } from './dog_routes';
import { initLitterRoutes } from './litter_routes';
import { initContactRoutes } from "./contact_routes";
import { initEventRoutes } from './event_routes';
import { initEventsRoutes } from './events_routes';
import { initProfileRoutes } from './profile_routes';
import { initPedigreeRoutes } from './pedigree_routes';
import { initBreedRoutes } from './breed_routes';


export const initRoutes = (app: Application, client: MongoClient) => {
  initUserRoutes(app, client);
  initDogRoutes(app, client);
  initLitterRoutes(app, client);
  initContactRoutes(app, client);
  initEventRoutes(app, client);
  initProfileRoutes(app,client);
  initEventsRoutes(app,client);
  initPedigreeRoutes(app,client);
  initBreedRoutes(app,client);
}
