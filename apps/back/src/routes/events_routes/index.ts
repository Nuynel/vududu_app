import {MongoClient} from "mongodb";
import {initDiagnosticsRoutes} from "./diagnostics_routes";
import {initTreatmentRoutes} from "./treatment_routes";
import {initHeatRoutes} from "./heat_routes";
import {initMateRoutes} from "./mate_routes";
import {initBirthRoutes} from "./birth_routes";
import {initRegistrationRoutes} from "./registration_routes";
import {Application} from "express";

export const initEventsRoutes = (app: Application, client: MongoClient) => {
  initDiagnosticsRoutes(app, client);
  initTreatmentRoutes(app, client);
  initHeatRoutes(app, client);
  initMateRoutes(app, client);
  initBirthRoutes(app, client);
  initRegistrationRoutes(app, client);
}
