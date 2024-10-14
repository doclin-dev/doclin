import jwt from 'jsonwebtoken';
import { User } from '../database/entities/User';
import {
  PRODUCTION_SERVER_URL,
  DEVELOPMENT_SERVER_URL,
  PRODUCTION,
  ACCESS_TOKEN_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  WEBAPP_URL,
} from '../envConstants';
import logger from '../logger';
import { Request, Response } from 'express';

const SERVER_URL = PRODUCTION ? PRODUCTION_SERVER_URL : DEVELOPMENT_SERVER_URL;

export const vscodeGithubCallback = (req: Request, res: Response) => {
  const token: string = req.user?.accessToken ?? '';
  res.redirect(`http://localhost:54321/auth?token=${token}`);
};

export const webappGithubCallback = (req: Request, res: Response) => {
  if (req.user) {
    const token: string = req.user.accessToken;

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: PRODUCTION,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  res.redirect(`${WEBAPP_URL}`);
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

export const webLogout = (req: Request, res: Response) => {
  res.clearCookie('authToken', { path: '/' });
  res.send();
};

export const vscodeGithubOAuthConfig = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `${SERVER_URL}/auth/github/callback/vscode`,
};

export const webappGithubOAuthConfig = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: `${SERVER_URL}/auth/github/callback/webapp`,
};
