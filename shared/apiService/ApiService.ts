import axios, { AxiosInstance } from 'axios';
import { ThreadApiService } from './ThreadApiService';
import { ApiServiceOptions } from '../types/ApiServiceOptions';

export class ApiService {
  public axiosInstance: AxiosInstance;
  public thread: ThreadApiService;

  constructor(options: ApiServiceOptions) {
    this.axiosInstance = axios.create({ baseURL: options.baseURL });
    this.setToken(options.token);

    this.thread = new ThreadApiService(this.axiosInstance);
  }

  public setToken(token: string | undefined) {
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
    }
  }
}
