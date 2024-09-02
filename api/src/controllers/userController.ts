import { Request, Response } from 'express';
import { UserRepository } from '../database/repositories/UserRepository';

import logger from '../logger';
import { User } from '../database/entities/User';
import { mapUserToUserDTO } from '../mappers/userToUserDTOMapper';
import { ParamsDictionary } from '../types/ParamsDictionary';
import { UserDTO } from '../../../shared/types/UserDTO';

export const getCurrentUser = async (req: Request<ParamsDictionary, UserDTO, {}>, res: Response<UserDTO>) => {
  const userId: number | undefined = req.userId;

  console.log('test');

  if (userId) {
    try {
      const user: User = await UserRepository.findUserById(userId);
      res.send(mapUserToUserDTO(user));
    } catch (error) {
      logger.error('User not found');
    }
  } else {
    res.status(401).send();
  }
};

export const postUserEmail = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
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
