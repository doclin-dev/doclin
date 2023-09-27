import "reflect-metadata";
import express from "express";
import { __prod__ } from "./constants";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import cors from "cors";
import router from "./routes/router";
import session from "express-session";
import "./database/dataSource";
import { AppDataSource } from "./database/dataSource";
import { githubOAuthConfig, githubLogin } from "./controllers/githubAuthController";

require("dotenv-safe").config();

const main = async () => {
  const app = express();

  AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });

  app.use(cors({ 
    origin: true, 
    optionsSuccessStatus: 200,
    credentials: true
  }));

  app.use(passport.initialize());

  app.use(express.json());

  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  
  app.use(session({
    secret: process.env.ACCESS_TOKEN_SECRET,
    resave: false,
    saveUninitialized: true
  }));

  passport.use(new GitHubStrategy(githubOAuthConfig, githubLogin));

  app.use("/", router);

  app.listen(3002, () => {
    console.log("Listening on localhost:3002");
  });
};

main();
