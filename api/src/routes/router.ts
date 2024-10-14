import express from 'express';
import passport from 'passport';
import { getCurrentUser, postUserEmail } from '../controllers/userController';
import { setUserIdOnReq, verifyAuthentication } from '../middlewares/authenticationMiddleware';
import { webLogout, vscodeGithubCallback, webappGithubCallback } from '../controllers/githubAuthController';
import { organizationRouter } from './organizationRouter';
import { redeemInvitation } from '../controllers/invitationController';
import { log } from '../controllers/loggerController';
import { printEndpointsOnLocal } from '../middlewares/localMiddleware';

const BASE_ORGANIZATION_ROUTE = '/organizations';

export const router = express.Router();
router.use([printEndpointsOnLocal, setUserIdOnReq]);

router.get('/', (_req, res) => res.send('doclin-api'));
router.get('/auth/github/vscode', passport.authenticate('github-vscode', { session: false }));
router.get('/auth/github/webapp', passport.authenticate('github-webapp', { session: false }));
router.get(
  '/auth/github/callback/vscode',
  passport.authenticate('github-vscode', { session: false }),
  vscodeGithubCallback
);
router.get(
  '/auth/github/callback/webapp',
  passport.authenticate('github-webapp', { session: false }),
  webappGithubCallback
);
router.get('/auth/user', getCurrentUser);
router.post('/auth/user', verifyAuthentication, postUserEmail);
router.post('/auth/user/webLogout', verifyAuthentication, webLogout);
router.post('/redeemInvitation', verifyAuthentication, redeemInvitation);
router.post('/log', log);

router.use(BASE_ORGANIZATION_ROUTE, organizationRouter);
