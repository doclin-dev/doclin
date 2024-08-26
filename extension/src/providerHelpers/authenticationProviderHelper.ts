import * as vscode from 'vscode';
import { API_BASE_URL, PRODUCTION } from '../envConstants';
import * as polka from 'polka';
import { SecretStorageManager } from '../SecretStorageManager';
import authApi from '../api/authApi';
import { SecretStorageType } from '../enums';
import logger from '../utils/logger';
import { User } from '../types';
import AuthenticatedUserCacheManager from '../utils/cache/AuthenticatedUserCacheManager';
import { getExtensionState } from '../utils/extensionState';

const AUTH_URL = vscode.Uri.parse(`${API_BASE_URL}/auth/github`);

const app = polka();

export const authenticate = (callback?: () => void) => {
  try {
    app.server?.close();

    app.get(`/auth`, (req, res) => getToken(req, res, callback));

    app.listen(54321, openApiUrl);
  } catch (error) {
    logger.error('An error occured when listening for authentication response' + error);
  }
};

const getToken = async (req: any, res: any, fn?: () => void) => {
  try {
    const token = req.query.token;

    if (!token) {
      res.end(`Authentication unsuccessful. Please try again later.`);
      logger.info('Authentication unsuccessful. Could not receive token.', true);
      app.server?.close();
      return;
    }

    res.end(`Authentication successful. You can close this now!`);
    logger.info('Authentication successful.', true);

    app.server?.close();

    await setTokenToStorage(token);

    if (fn) {
      fn();
    }
  } catch (error) {
    logger.error(`An error occured when receiving token ${error}`, true);
  }
};

const openApiUrl = (err: Error) => {
  if (err) {
    logger.error(err.message);
  }

  vscode.commands.executeCommand('vscode.open', AUTH_URL);
};

export const getAuthenticatedUser = async (): Promise<User | undefined> => {
  const autheticatedUserCacheManger = new AuthenticatedUserCacheManager();
  const authenticatedUserCache = await autheticatedUserCacheManger.getAuthenticatedUser();

  if (authenticatedUserCache) {
    return authenticatedUserCache;
  }

  const response = await authApi.getAuthenticatedUser();
  const payload = response?.data;
  const user: User = payload?.user;

  await autheticatedUserCacheManger.setAuthenticatedUser(user);

  return user;
};

const setTokenToStorage = async (token: string | null) => {
  if (PRODUCTION) {
    await SecretStorageManager.store(SecretStorageType.PROD_AUTH_TOKEN, token);
  } else {
    await SecretStorageManager.store(SecretStorageType.DEV_AUTH_TOKEN, token);
  }
};

export const logout = async () => {
  await setTokenToStorage('');
  const autheticatedUserCacheManger = new AuthenticatedUserCacheManager();
  await autheticatedUserCacheManger.clearAuthenticatedUser();
};

export const registerEmail = async (email: string) => {
  try {
    await authApi.postUserEmail(email);

    const authenticatedUserCacheManager = new AuthenticatedUserCacheManager();
    await authenticatedUserCacheManager.clear();

    return getExtensionState();
  } catch (error) {
    logger.error(`An error occured when registering your email. ${error}`, true);
  }
};
