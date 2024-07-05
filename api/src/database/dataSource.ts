import { join } from 'path';
import { DataSource } from 'typeorm';
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, PRODUCTION } from '../envConstants';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  entities: [join(__dirname, '/entities/*.*')],
  synchronize: true,
  ssl: PRODUCTION,
  extra: PRODUCTION
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : null,
});
