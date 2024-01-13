import { join } from "path";
import { DataSource } from "typeorm"

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASS = process.env.DB_PASS || "";
const DB_NAME = process.env.DB_NAME || "doclin";
const PRODUCTION = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    entities: [join(__dirname, "/entities/*.*")],
    synchronize: !PRODUCTION,
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    },
});