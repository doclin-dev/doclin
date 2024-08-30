import { Request, Response } from 'express';
import { Log } from '../database/entities/Log';

export const log = async (req: Request, res: Response) => {
  const type = req.body.type;
  const message = req.body.message;
  const userId = req.userId;

  Log.create({
    type: type,
    message: message,
    userId: userId,
  }).save();

  res.send('logged!');
};
