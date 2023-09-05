import axios, { AxiosInstance } from 'axios';
import { apiBaseUrl } from '../constants';
import { GlobalStateManager } from '../GlobalStateManager';
import * as vscode from "vscode";

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
            vscode.window.showInformationMessage("Unexpected error occured!");
            return Promise.reject(error);
        }
    );
  
    return instance;
};