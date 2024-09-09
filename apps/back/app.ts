import express from 'express';
import cors from 'cors';
import {MongoClient} from 'mongodb';
import path from 'path';
import {initRoutes} from "./src/routes";
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import {checkAndInsertBreeds} from "./src/integrations/checkAndInsertBreeds";

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const CORS_ORIGIN = process.env.CORS_ORIGIN;

// const mongoDataBase = new MongoClient('mongodb://nuynel:secretPassword@mongodb:27017');
const mongoDataBase = new MongoClient(MONGO_URI);

const app = express();

const router = express.Router();

// ToDo сделать совладение и аренду
// ToDo пользователь может завести карточку собаки, но указать её как собаку другого питомника/заводчика
// ToDo редактор документов сделать через YoptaEditor и IronPDF??
// ToDo разделить апи на публичные и приватные и для приватных сделать проверку API через middleware

// app.use(logger('dev'));
app.use(express.json());
app.use(cors({
  origin: CORS_ORIGIN, // Разрешить запросы только с этого домена
  credentials: true, // Разрешить отправку cookies и других учетных данных
}));
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

// Обслуживание статических файлов React
app.use('/app', express.static(path.join(__dirname, '../front')));

app.use('/api', router);

const startServer = async () => {
  await mongoDataBase.connect()
  initRoutes(app, mongoDataBase)

  // await checkAndInsertBreeds(mongoDataBase)

  app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front', 'index.html'));
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/landing', 'index.html'));  // Указываем полный путь до файла
  });

  app.listen(PORT, () => {
    console.log('We are live on port ' + PORT);
  });
}

startServer();

export default app;
