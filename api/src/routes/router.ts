import express from 'express';
import passport from 'passport';
import { getCurrentUser, postUserEmail } from '../controllers/userController';
import { verifyAuthentication } from '../middlewares/auth';
import { githubCallback } from '../controllers/githubAuthController';
import organizationRouter from './organizationRouter';
import { redeemInvitation } from '../controllers/invitationController';
import { log } from '../controllers/loggerController';
import { PRODUCTION } from '../envConstants';
import logger from '../logger';

const BASE_ORGANIZATION_ROUTE = '/organizations';

const router = express.Router();

if (!PRODUCTION) {
  router.use((req, _res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}

router.get('/', (_req, res) => res.send('doclin-api'));
router.get('/auth/github', passport.authenticate('github', { session: false }));
router.get('/auth/github/callback', passport.authenticate('github', { session: false }), githubCallback);
router.get('/auth/user', getCurrentUser);
router.post('/auth/user', postUserEmail);
router.post('/redeemInvitation', verifyAuthentication, redeemInvitation);
router.post('/log', log);

router.use(BASE_ORGANIZATION_ROUTE, verifyAuthentication, organizationRouter);

export default router;
