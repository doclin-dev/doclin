import { Request, Response } from 'express';
import { UserRepository } from '../database/repositories/UserRepository';

import logger from '../logger';
import { User } from '../database/entities/User';
import { mapUserToUserDTO } from '../mappers/userToUserDTOMapper';
import { ParamsDictionary } from '../types/ParamsDictionary';
import { UserDTO } from '../../../shared/types/UserDTO';
import { IncludePropertiesQueryDTO } from '../../../shared/types/IncludePropertiesQueryDTO';

export const getCurrentUser = async (
  req: Request<ParamsDictionary, UserDTO, {}, IncludePropertiesQueryDTO>,
  res: Response<UserDTO>
) => {
  const userId: number | undefined = req.userId;
  const includeProperties: boolean = !!req.query.includeProperties;

  if (userId) {
    try {
      let user: User;
      if (includeProperties) {
        user = await UserRepository.findUserWithPropertiesById(userId);
      } else {
        user = await UserRepository.findUserById(userId);
      }
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
    res.send({ user });
  } catch (error) {
    logger.error(`User email wasn't resgitered. error: ${error}`);
  }
};
