export const PRODUCTION = process.env.production === "production";

export const DEVELOPMENT_PORT = 3000;
export const DEVELOPMENT_SERVER_URL = `http://localhost:${DEVELOPMENT_PORT}`;

export const PRODUCTION_PORT = 443;
export const PRODUCTION_SERVER_URL = "https://api.doclin.dev";
export const SSL_PRIV_KEY_PATH = "/etc/letsencrypt/live/api.doclin.dev/privkey.pem";
export const SSL_CERT_PATH = "/etc/letsencrypt/live/api.doclin.dev/fullchain.pem";

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASS = process.env.DB_PASS || "";
export const DB_NAME = process.env.DB_NAME || "doclin";

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;