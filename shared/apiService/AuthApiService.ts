import { AxiosResponse } from 'axios';
import { AbstracApiService } from './AbstractApiService';
import { UserDTO } from '../types/UserDTO';
import { IncludePropertiesQueryDTO } from '../types/IncludePropertiesQueryDTO';

const BASE_AUTH_URL = '/auth/user';

export class AuthApiService extends AbstracApiService {
  public async getAuthenticatedUser(): Promise<AxiosResponse<UserDTO>> {
    const response: AxiosResponse<UserDTO> = await this.axiosInstance.get(BASE_AUTH_URL);
    return response;
  }

  public async getAuthenticatedUserWithProperties(): Promise<AxiosResponse<UserDTO>> {
    const params: IncludePropertiesQueryDTO = {
      includeProperties: true,
    };
    const response: AxiosResponse<UserDTO> = await this.axiosInstance.get(BASE_AUTH_URL, { params });
    return response;
  }

  public async postUserEmail(email: string): Promise<AxiosResponse<UserDTO>> {
    const response: AxiosResponse<UserDTO> = await this.axiosInstance.post(BASE_AUTH_URL, email);
    return response;
  }

  public async webLogout(): Promise<AxiosResponse<{}>> {
    const response: AxiosResponse<UserDTO> = await this.axiosInstance.post(`${BASE_AUTH_URL}/webLogout`);
    return response;
  }
}
