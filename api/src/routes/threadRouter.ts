import express from 'express';
import {
  deleteThread,
  getThread,
  getThreads,
  postThread,
  searchThreads,
  updateThread,
} from '../controllers/threadController';
import { replyRouter } from './replyRouter';
import { verifyProjectVisibility } from '../middlewares/projectMiddleware';
import { verifyThreadOwnerOrOrganizationMember } from '../middlewares/threadMiddleware';
import { verifyAuthentication } from '../middlewares/authenticationMiddleware';

const BASE_REPLY_ROUTE = '/:threadId/replies';

const threadRouter = express.Router({ mergeParams: true });

threadRouter.post('/', [verifyAuthentication, verifyProjectVisibility], postThread);
threadRouter.get('/', verifyProjectVisibility, getThreads);
threadRouter.get('/search', verifyProjectVisibility, searchThreads);
threadRouter.get('/:threadId', verifyProjectVisibility, getThread);
threadRouter.put('/:threadId', verifyThreadOwnerOrOrganizationMember, updateThread);
threadRouter.delete('/:threadId', verifyThreadOwnerOrOrganizationMember, deleteThread);

threadRouter.use(BASE_REPLY_ROUTE, replyRouter);

export default threadRouter;
