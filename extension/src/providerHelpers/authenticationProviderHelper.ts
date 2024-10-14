import * as vscode from 'vscode';
import { API_BASE_URL, PRODUCTION } from '../envConstants';
import * as polka from 'polka';
import { SecretStorageManager } from '../SecretStorageManager';
import { SecretStorageType } from '../enums';
import logger from '../utils/logger';
import AuthenticatedUserCacheManager from '../utils/cache/AuthenticatedUserCacheManager';
import { reloadAndGetExtensionState } from '../utils/extensionState';
import AllThreadsCacheManager from '../utils/cache/AllThreadsCacheManager';
import { apiService } from '../apiService';
import { getExtensionState } from '../utils/extensionState';
import { UserDTO } from '$shared/types/UserDTO';
import { ApiError } from '$shared/types/ApiError';

const AUTH_URL = vscode.Uri.parse(`${API_BASE_URL}/auth/github/vscode`);

const app = polka();

export const authenticate = (callback?: () => void) => {
  try {
    app.server?.close();

    app.get(`/auth`, (req, res) => getToken(req, res, callback));

    app.listen(54321, openApiUrl);
  } catch (error) {
    logger.error(`An error occured when listening for authentication response. ${error}`, true);
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
    const allThreadsCacheManager = new AllThreadsCacheManager();
    await allThreadsCacheManager.clear();

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

export const getAuthenticatedUser = async (): Promise<UserDTO | undefined> => {
  const autheticatedUserCacheManger = new AuthenticatedUserCacheManager();
  const authenticatedUserCache = await autheticatedUserCacheManger.getAuthenticatedUser();

  if (authenticatedUserCache) {
    return authenticatedUserCache;
  }

  try {
    const response = await apiService.auth.getAuthenticatedUser();
    const user: UserDTO = response?.data;
    await autheticatedUserCacheManger.setAuthenticatedUser(user);
    return user;
  } catch (error: unknown) {
    const axiosError = error as ApiError;

    if (axiosError.status === 401) {
      return;
    }

    throw error;
  }
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
  return await reloadAndGetExtensionState();
};

export const registerEmail = async (email: string) => {
  try {
    await apiService.auth.postUserEmail(email);

    const authenticatedUserCacheManager = new AuthenticatedUserCacheManager();
    await authenticatedUserCacheManager.clear();

    return getExtensionState();
  } catch (error) {
    logger.error(`An error occured when registering your email. ${error}`, true);
  }
};
