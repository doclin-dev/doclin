import { ApiService } from '../../shared/apiService/ApiService';
import { API_BASE_URL, PRODUCTION } from './envConstants';
import { ApiServiceOptions } from '../../shared/types/ApiServiceOptions';
import { SecretStorageManager } from './SecretStorageManager';
import { SecretStorageType } from './enums';

const options: ApiServiceOptions = { baseURL: API_BASE_URL };
export const apiService = new ApiService(options);

apiService.axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getAuthToken = async () => {
  if (PRODUCTION) {
    return await SecretStorageManager.get(SecretStorageType.PROD_AUTH_TOKEN);
  } else {
    return await SecretStorageManager.get(SecretStorageType.DEV_AUTH_TOKEN);
  }
};
