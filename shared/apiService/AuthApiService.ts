import { AbstracApiService } from './AbstractApiService';

const baseAuthUrl = '/auth/user';

export class AuthApiService extends AbstracApiService {
  public async getAuthenticatedUser() {
    const response = await this.axiosInstance.get(baseAuthUrl);

    return response;
  }

  public async postUserEmail(email: string) {
    const response = await this.axiosInstance.post(baseAuthUrl, email);
    return response;
  }
}
