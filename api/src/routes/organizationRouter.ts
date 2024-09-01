import express from 'express';
import { getOrganization, getOrganizations, postOrganization } from '../controllers/organizationController';
import { verifyAuthentication } from '../middlewares/authenticationMiddleware';
import { projectRouter } from './projectRouter';

const BASE_PROJECT_ROUTE = '/:organizationId/projects';

export const organizationRouter = express.Router({ mergeParams: true });

organizationRouter.get('/', verifyAuthentication, getOrganizations);
organizationRouter.post('/', verifyAuthentication, postOrganization);
organizationRouter.get('/:organizationId', getOrganization);

organizationRouter.use(BASE_PROJECT_ROUTE, projectRouter);
