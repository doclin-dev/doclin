import { AxiosResponse } from 'axios';
import { AbstracApiService } from './AbstractApiService';
import { UserDTO } from '../types/UserDTO';

const baseAuthUrl = '/auth/user';

export class AuthApiService extends AbstracApiService {
  public async getAuthenticatedUser(): Promise<AxiosResponse<UserDTO>> {
    const response: AxiosResponse<UserDTO> = await this.axiosInstance.get(baseAuthUrl);
    return response;
  }

  public async postUserEmail(email: string) {
    const response = await this.axiosInstance.post(baseAuthUrl, email);
    return response;
  }
}
