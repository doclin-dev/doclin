import jwt from 'jsonwebtoken';
import { User } from '../database/entities/User';
import {
  PRODUCTION_SERVER_URL,
  DEVELOPMENT_SERVER_URL,
  PRODUCTION,
  ACCESS_TOKEN_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from '../envConstants';
import logger from '../logger';

const SERVER_URL = PRODUCTION ? PRODUCTION_SERVER_URL : DEVELOPMENT_SERVER_URL;

export const githubCallback = (req: any, res: any) => {
  res.redirect(`http://localhost:54321/auth?token=${req.user.accessToken}`);
};

export const githubLogin = async (_accessToken: any, _refreshToken: any, profile: any, cb: any) => {
  try {
    let user = await User.findOne({ where: { githubId: profile.id } });

    if (user) {
      user.name = profile.displayName ?? profile.username;
      await user.save();
    } else {
      user = await User.create({
        name: profile.displayName ?? profile.username,
        githubId: profile.id,
      }).save();
    }

    cb(null, {
      accessToken: jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
        expiresIn: '1y',
      }),
    });
  } catch (error) {
    logger.error('Error during github login' + error);
  }
};

export const githubOAuthConfig = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `${SERVER_URL}/auth/github/callback`,
};
