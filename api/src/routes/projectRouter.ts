import express from 'express';
import { postProject, getProjects, getProject } from '../controllers/projectController';
import threadRouter from './threadRouter';
import { sendInvitation } from '../controllers/invitationController';
import copilotRouter from './copilotRouter';
import { verifyOrganizationAccess } from '../middlewares/organizationMiddleware';
import { verifyProjectVisibility } from '../middlewares/projectMiddleware';

export const projectRouter = express.Router({ mergeParams: true });

const BASE_THREAD_ROUTE = '/:projectId/threads';
const BASE_COPILOT_ROUTE = '/:projectId/copilot';

projectRouter.post('/', verifyOrganizationAccess, postProject);
projectRouter.get('/', verifyOrganizationAccess, getProjects);
projectRouter.get('/:projectId', verifyProjectVisibility, getProject);
projectRouter.post('/:projectId/invite', verifyOrganizationAccess, sendInvitation);

projectRouter.use(BASE_THREAD_ROUTE, threadRouter);
projectRouter.use(BASE_COPILOT_ROUTE, copilotRouter);
