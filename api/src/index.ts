import "reflect-metadata";
import express from "express";
import { __prod__ } from "./constants";
import { User } from "./database/entities/User";
import { Strategy as GitHubStrategy } from "passport-github";
import passport from "passport";
import jwt from "jsonwebtoken";
import cors from "cors";
import router from "./routes/router";
import session from "express-session";
import "./database/dataSource";
import { AppDataSource } from "./database/dataSource";

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

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback",
      },
      async (_, __, profile, cb) => {
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
          user.name = profile.displayName;
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
          }).save();
        }
        cb(null, {
          accessToken: jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1y",
            }
          ),
        });
      }
    )
  );

  app.use("/", router);

  app.listen(3002, () => {
    console.log("listening on localhost:3002");
  });
};

main();
