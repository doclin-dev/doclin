import { NextFunction, Request, Response } from 'express';
import { verifyOrganizationAccess } from './organizationMiddleware';
import { ReplyRepository } from '../database/repositories/ReplyRepository';
import { Reply } from '../database/entities/Reply';

export const verifyReplyOwnerOrOrganizationMember = async (req: Request, res: Response, next: NextFunction) => {
  const replyId: number = parseInt(req.params.replyId);
  const reply: Reply | null = await ReplyRepository.findReplyById(replyId);

  if (reply === null) {
    res.status(404).send('Thread do not exist!');
    return;
  }

  if (reply.userId !== req.userId) {
    verifyOrganizationAccess(req, res, next);
    return;
  }

  next();
};
