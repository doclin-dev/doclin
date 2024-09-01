import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserRepository } from '../database/repositories/UserRepository';
import { ACCESS_TOKEN_SECRET } from '../envConstants';
import logger from '../logger';
import { User } from '../database/entities/User';

export const getCurrentUser = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const userId = getUserIdFromAuthHeader(authHeader);

  if (userId === null) {
    res.send({ user: null });
    return;
  }

  const user: User = await UserRepository.findUserById(userId);

  res.send({ user });
};

export const getUserIdFromAuthHeader = (authHeader: string | undefined): number | null => {
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const payload: any = jwt.verify(token, ACCESS_TOKEN_SECRET);

    if (!payload.userId) {
      return null;
    }

    return payload.userId;
  } catch {
    return null;
  }
};

export const postUserEmail = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const userId = getUserIdFromAuthHeader(authHeader);
    const email = req.body.email;

    if (!userId) {
      throw Error('User is not authenticated');
    }

    const user: User = await UserRepository.findUserById(userId);
    user.email = email;
    await user.save();

    logger.info('User email has been successfully registered.');
    res.send({ email });
  } catch (error) {
    logger.error(`User email wasn't resgitered. error: ${error}`);
  }
};
