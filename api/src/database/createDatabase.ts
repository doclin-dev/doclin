import { Client } from 'pg';
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from '../envConstants';
import { AppDataSource } from './dataSource';
import logger from '../logger';

const config = {
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASS,
  port: DB_PORT,
};

export async function initializeDatabase() {
  await createDatabaseIfNotExists();
  await createPgvectorExtension();
  await initializeDataSource();
}

const createDatabaseIfNotExists = async () => {
  const client = new Client(config);

  try {
    await client.connect();
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'`);

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.info(`Database ${DB_NAME} created successfully.`);
    } else {
      console.info(`Database ${DB_NAME} already exists.`);
    }
  } catch (error) {
    throw new Error(`Error creating database: ${error}`);
  } finally {
    await client.end();
  }
};

const createPgvectorExtension = async () => {
  const client = new Client({
    ...config,
    database: DB_NAME,
  });

  try {
    await client.connect();
    await client.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
  } catch (error) {
    throw new Error(`Error creating EXTENSION vector: ${error}`);
  } finally {
    await client.end();
  }
};

const initializeDataSource = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Data Source has been initialized!');
  } catch (error) {
    throw new Error(`Error during Data Source initialization: ${error}`);
  }
};
