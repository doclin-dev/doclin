import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../database/repositories/UserRepository';
import { getUserIdFromAuthHeader } from '../controllers/userController';

export const setUserIdOnReq = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const userId = getUserIdFromAuthHeader(authHeader);

  if (userId) {
    const user = await UserRepository.findUserById(userId);

    if (user) {
      req.userId = userId;
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