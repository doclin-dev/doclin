import { AxiosResponse } from 'axios';
import { AbstracApiService } from './AbstractApiService';
import { UserDTO } from '../types/UserDTO';
import { IncludePropertiesQueryDTO } from '../types/IncludePropertiesQueryDTO';

const baseAuthUrl = '/auth/user';

export class AuthApiService extends AbstracApiService {
  public async getAuthenticatedUser(): Promise<AxiosResponse<UserDTO>> {
    const response: AxiosResponse<UserDTO> = await this.axiosInstance.get(baseAuthUrl);
    return response;
  }

  public async getAuthenticatedUserWithProperties(): Promise<AxiosResponse<UserDTO>> {
    const params: IncludePropertiesQueryDTO = {
      includeProperties: true,
    };
    const response: AxiosResponse<UserDTO> = await this.axiosInstance.get(baseAuthUrl, { params });
    return response;
  }

  public async postUserEmail(email: string) {
    const response = await this.axiosInstance.post(baseAuthUrl, email);
    return response;
  }
}
