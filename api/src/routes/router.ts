import express from 'express';
import passport from 'passport';
import { getCurrentUser, postUserEmail } from '../controllers/userController';
import { setUserIdOnReq, verifyAuthentication } from '../middlewares/authenticationMiddleware';
import { githubCallback } from '../controllers/githubAuthController';
import { organizationRouter } from './organizationRouter';
import { redeemInvitation } from '../controllers/invitationController';
import { log } from '../controllers/loggerController';
import { printEndpointsOnLocal } from '../middlewares/localMiddleware';
import { verifyOrganizationAccess } from '../middlewares/organizationMiddleware';

const BASE_ORGANIZATION_ROUTE = '/organizations';

const router = express.Router();
router.use([printEndpointsOnLocal, setUserIdOnReq]);

router.get('/', (_req, res) => res.send('doclin-api'));
router.get('/auth/github', passport.authenticate('github', { session: false }));
router.get('/auth/github/callback', passport.authenticate('github', { session: false }), githubCallback);
router.get('/auth/user', getCurrentUser);
router.post('/auth/user', verifyAuthentication, postUserEmail);
router.post('/redeemInvitation', verifyAuthentication, redeemInvitation);
router.post('/log', log);

router.use(BASE_ORGANIZATION_ROUTE, organizationRouter);

export default router;
