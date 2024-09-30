import { AxiosInstance } from 'axios';

export abstract class AbstracApiService {
  protected axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }
}
