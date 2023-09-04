import axios, { AxiosInstance } from 'axios';
import { apiBaseUrl } from '../constants';
import { GlobalStateManager } from '../GlobalStateManager';

export const createAxiosInstance = (token: string | null) => {
    const instance: AxiosInstance = axios.create({
      baseURL: apiBaseUrl,
    });
  
    // Set headers dynamically
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common['Authorization'];
    }

    instance.interceptors.response.use(
        response => response,
        error => {
            return Promise.reject(error);
        }
    );
  
    return instance;
};