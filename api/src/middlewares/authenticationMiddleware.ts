import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../database/repositories/UserRepository';
import { User } from '../database/entities/User';
import { ACCESS_TOKEN_SECRET } from '../envConstants';
import jwt from 'jsonwebtoken';
import logger from '../logger';

export const setUserIdOnReq = async (req: Request, _res: Response, next: NextFunction) => {
  const authorizationHeader: string | undefined = req.headers.authorization;
  const cookies = req.cookies;
  let token: string;

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  } else if (cookies && cookies.authToken) {
    token = cookies.authToken;
  } else {
    next();
    return;
  }

  try {
    const userId = getUserIdFromToken(token);
    const user: User = await UserRepository.findUserById(userId);
    req.userId = user.id;
  } catch (error) {
    logger.error('Invalid auth token');
  }

  next();
};

export const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.userId) {
    res.status(403).send('Unauthenticated');
    return;
  }

  next();
};

const getUserIdFromToken = (token: string): number => {
  const payload: any = jwt.verify(token, ACCESS_TOKEN_SECRET);
  return payload.userId as number;
};
