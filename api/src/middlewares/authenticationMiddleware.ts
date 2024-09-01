import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../database/repositories/UserRepository';
import { getUserIdFromAuthHeader } from '../controllers/userController';
import { User } from '../database/entities/User';
import logger from '../logger';

export const setUserIdOnReq = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const userId = getUserIdFromAuthHeader(authHeader);

  if (userId) {
    try {
      const user: User = await UserRepository.findUserById(userId);
      req.userId = user.id;
    } catch (error) {
      logger.error('Invalid auth header. User not found.');
    }
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
