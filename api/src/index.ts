import 'reflect-metadata';
import express, { Application } from 'express';
import https from 'https';
import { Strategy as GitHubStrategy } from 'passport-github';
import passport from 'passport';
import cors from 'cors';
import { router } from './routes/router';
import session from 'express-session';
import { initializeDatabase } from './database/createDatabase';
import { vscodeGithubOAuthConfig, githubLogin, webappGithubOAuthConfig } from './controllers/githubAuthController';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import {
  PRODUCTION,
  DEVELOPMENT_PORT,
  PRODUCTION_PORT,
  SSL_CERT_PATH,
  SSL_PRIV_KEY_PATH,
  ACCESS_TOKEN_SECRET,
} from './envConstants';
import logger from './logger';

const main = async () => {
  await initializeDatabase();

  logUncaughtExceptions();
  const app: Application = express();
  initializeCors(app);
  initializeSession(app);
  initializePassportAuthentication(app);
  initializeCookieParser(app);
  initializeJsonCommunication(app);
  initializeRouter(app);

  if (PRODUCTION) {
    listenToProductionPort(app);
  } else {
    listenToDevelopmentPort(app);
  }
};

const logUncaughtExceptions = () => {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception: ' + error.message);
    process.exit(1);
  });
};

const initializeCors = (app: Application) => {
  app.use(
    cors({
      origin: true,
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );
};

const initializeSession = (app: Application) => {
  app.use(
    session({
      secret: ACCESS_TOKEN_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
};

const initializePassportAuthentication = (app: Application) => {
  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });

  app.use(passport.initialize());
  passport.use('github-vscode', new GitHubStrategy(vscodeGithubOAuthConfig, githubLogin));
  passport.use('github-webapp', new GitHubStrategy(webappGithubOAuthConfig, githubLogin));
};

const initializeCookieParser = (app: Application) => {
  app.use(cookieParser());
};

const initializeJsonCommunication = (app: Application) => {
  app.use(express.json());

  app.use(
    express.urlencoded({
      extended: true,
    })
  );
};

const initializeRouter = (app: Application) => {
  app.use('/', router);
};

const listenToProductionPort = (app: Application) => {
  try {
    const key = fs.readFileSync(SSL_PRIV_KEY_PATH, 'utf8');
    const cert = fs.readFileSync(SSL_CERT_PATH, 'utf8');
    const credentials = { key, cert };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(PRODUCTION_PORT, () => {
      logger.info(`Listening on https://localhost:${PRODUCTION_PORT}`);
    });
  } catch (error) {
    logger.error(error);
  }
};

const listenToDevelopmentPort = (app: Application) => {
  app.listen(DEVELOPMENT_PORT, () => {
    logger.info(`Listening on localhost:${DEVELOPMENT_PORT}`);
  });
};

main();
