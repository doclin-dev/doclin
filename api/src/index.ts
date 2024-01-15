require("dotenv-safe").config({ allowEmptyValues: true });
import "reflect-metadata";
import express, { Application } from "express";
import https from "https";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import cors from "cors";
import router from "./routes/router";
import session from "express-session";
import { AppDataSource } from "./database/dataSource";
import { githubOAuthConfig, githubLogin } from "./controllers/githubAuthController";
import fs from 'fs';
import { 
  PRODUCTION, 
  DEVELOPMENT_PORT, 
  PRODUCTION_PORT, 
  SSL_CERT_PATH, 
  SSL_PRIV_KEY_PATH, 
  ACCESS_TOKEN_SECRET
} from "./envConstants";

const main = async () => {
  const app: Application = express();

  initializeDatabase();
  initializeCors(app);
  initializeSession(app);
  initializePassportAuthentication(app);
  initializeJsonCommunication(app);
  initializeRouter(app);

  if (PRODUCTION) {
    listenToProductionPort(app);
  } else {
    listenToDevelopmentPort(app);
  }
};

const initializeDatabase = () => {
  AppDataSource.initialize().then(() => {
    console.debug("Data Source has been initialized!");
  }).catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
}

const initializeCors = (app: Application) => {
  app.use(cors({ 
    origin: true, 
    optionsSuccessStatus: 200,
    credentials: true
  }));
}

const initializeSession = (app: Application) => {
  app.use(session({
    secret: ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: true
  }));
}

const initializePassportAuthentication = (app: Application) => {
  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });

  app.use(passport.initialize());
  passport.use(new GitHubStrategy(githubOAuthConfig, githubLogin));
}

const initializeJsonCommunication = (app: Application) => {
  app.use(express.json());

  app.use(
    express.urlencoded({
      extended: true,
    })
  );
}

const initializeRouter = (app: Application) => {
  app.use("/", router);
}

const listenToProductionPort = (app: Application) => {
  if (process.getuid && process.getuid() === 0) {
    console.log('Node.js process is running as root user.');
  } else {
    console.log('Node.js process is not running as root user.');
  }
  
  console.log(`Checking for SSL certificate files at: ${SSL_CERT_PATH} and ${SSL_PRIV_KEY_PATH}`);

  if (!fs.existsSync(SSL_CERT_PATH) || !fs.existsSync(SSL_PRIV_KEY_PATH)) {
    console.error('SSL certificate files not found');
    process.exit(1);
  }

  const key = fs.readFileSync(SSL_PRIV_KEY_PATH, 'utf8');
  const cert = fs.readFileSync(SSL_CERT_PATH, 'utf8');
  const credentials = { key, cert };
  
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(PRODUCTION_PORT, () => {
    console.debug(`Listening on https://localhost:${PRODUCTION_PORT}`);
  });
}

const listenToDevelopmentPort = (app: Application) => {
  app.listen(DEVELOPMENT_PORT, () => {
    console.debug(`Listening on localhost:${DEVELOPMENT_PORT}`)
  });
}

main();