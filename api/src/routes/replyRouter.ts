import express from 'express';
import { deleteReply, getReplies, postReply, updateReplyMessage } from '../controllers/replyController';

const replyRouter = express.Router({ mergeParams: true });

replyRouter.post('/', postReply);
replyRouter.get('/', getReplies);
replyRouter.put('/:id', updateReplyMessage);
replyRouter.delete('/:id', deleteReply);

export default replyRouter;
