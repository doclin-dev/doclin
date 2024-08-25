import express from 'express';
import { deleteReply, getReplies, postReply, updateReplyMessage } from '../controllers/replyController';
import { verifyAuthentication } from '../middlewares/authenticationMiddleware';
import { verifyProjectVisibility } from '../middlewares/projectMiddleware';
import { verifyReplyOwnerOrOrganizationMember } from '../middlewares/replyMiddleware';

export const replyRouter = express.Router({ mergeParams: true });

replyRouter.post('/', [verifyAuthentication, verifyProjectVisibility], postReply);
replyRouter.get('/', verifyProjectVisibility, getReplies);
replyRouter.put('/:replyId', verifyReplyOwnerOrOrganizationMember, updateReplyMessage);
replyRouter.delete('/:replyId', verifyReplyOwnerOrOrganizationMember, deleteReply);
