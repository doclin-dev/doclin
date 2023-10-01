import axios, { AxiosInstance } from 'axios';
import { apiBaseUrl as baseURL } from '../constants';
import * as vscode from "vscode";
import { GlobalStateManager } from '../GlobalStateManager';

export const createAxiosInstance = () => {
	const token: string | null = GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN);

    const instance: AxiosInstance = axios.create({ baseURL });

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