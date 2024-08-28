import axios, { AxiosInstance } from 'axios';
import { ThreadApiService } from './ThreadApiService';
import { ApiClientOptions } from '../types/ApiServiceOptions';

export class ApiClient {
  private instance: AxiosInstance;

  public thread: ThreadApiService;

  constructor(options: ApiClientOptions) {
    this.instance = axios.create({ baseURL: options.baseURL });
    this.setToken(options.token);
    this.handleErrors();

    this.thread = new ThreadApiService(this.instance);
  }

  public setToken(token: string | undefined) {
    if (token) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.instance.defaults.headers.common['Authorization'];
    }
  }

  private handleErrors() {
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}
