import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import {COLLECTIONS, DB_NAME} from "../constants";

// Получить выполненные миграции из базы данных
const getFulfilledMigrations = async (client: MongoClient) => {
  const collection = client.db(DB_NAME).collection(COLLECTIONS.MIGRATIONS);
  const fulfilledMigrations = await collection.find({ fulfilled: true }).toArray();
  return fulfilledMigrations.map(migration => migration.file_name);
};

// Получить список файлов с миграциями из папки
const getMigrationFiles = (folderPath: string) => fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

// Выполнить миграцию
const executeMigration = async (client: MongoClient, filePath: string): Promise<{success: boolean, error: null | string}> => {
  try {
    const { up } = await import(filePath);
    await up(client);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: null }
  }
};

// Обработать миграции
export const processMigrations = async (client: MongoClient) => {
  const folderPath = path.join(__dirname, 'migrations');

  const fulfilledMigrations = await getFulfilledMigrations(client);
  const allMigrationFiles = getMigrationFiles(folderPath);

  const pendingMigrations = allMigrationFiles.filter(file => !fulfilledMigrations.includes(file));

  for (const file of pendingMigrations) {
    const filePath = path.join(folderPath, file);
    const { success, error } = await executeMigration(client, filePath);

    const migrationDocument = {
      file_name: file,
      date: Date.now(),
      fulfilled: success,
      error: error,
    };

    await client.db(DB_NAME).collection(COLLECTIONS.MIGRATIONS).insertOne(migrationDocument);
  }

  return `Processed ${pendingMigrations.length} migrations.`;
};

