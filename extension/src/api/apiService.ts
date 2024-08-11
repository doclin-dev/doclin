import * as vscode from 'vscode';
import axios, { AxiosInstance } from 'axios';
import { PRODUCTION, API_BASE_URL as baseURL } from '../envConstants';
import { SecretStorageManager } from '../SecretStorageManager';
import { SecretStorageType } from '../enums';

export const createAxiosInstance = async () => {
  const token: string | null = await getToken();

  const instance: AxiosInstance = axios.create({ baseURL });

  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      vscode.window.showErrorMessage(`An error occured. ${error}`);
      return Promise.reject(error);
    }
  );

  return instance;
};

const getToken = async () => {
  if (PRODUCTION) {
    return await SecretStorageManager.get(SecretStorageType.PROD_AUTH_TOKEN);
  } else {
    return await SecretStorageManager.get(SecretStorageType.DEV_AUTH_TOKEN);
  }
};
