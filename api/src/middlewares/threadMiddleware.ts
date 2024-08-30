import { NextFunction, Request, Response } from 'express';
import { Thread } from '../database/entities/Thread';
import { ThreadRepository } from '../database/repositories/ThreadRepository';
import { verifyOrganizationAccess } from './organizationMiddleware';

export const verifyThreadOwnerOrOrganizationMember = async (req: Request, res: Response, next: NextFunction) => {
  const threadId: number = parseInt(req.params.threadId);
  const thread: Thread | null = await ThreadRepository.findThreadById(threadId);

  if (thread === null) {
    res.status(404).send('Thread do not exist!');
    return;
  }

  if (thread.userId !== req.userId) {
    verifyOrganizationAccess(req, res, next);
    return;
  }

  next();
};
