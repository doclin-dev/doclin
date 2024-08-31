import { AbstracApiService } from './AbstractApiService';

export class OrganizationApiService extends AbstracApiService {
  private BASE_ORGANIZATION_URL = `/organizations`;

  public async getOrganizations() {
    const response = await this.axiosInstance.get(this.BASE_ORGANIZATION_URL);
    return response;
  }

  public async postOrganization(name: string) {
    const data = {
      name: name,
    };

    const response = await this.axiosInstance.post(this.BASE_ORGANIZATION_URL, data);
    return response;
  }

  public async getOrganization(organizationId: string) {
    const params = {
      includeMembers: true,
    };

    const response = await this.axiosInstance.get(`${this.BASE_ORGANIZATION_URL}/${organizationId}`, { params });
    return response;
  }

  public async getOrganizationUsers(organizationId: string) {
    const params = {
      includeMembers: true,
    };

    const invitationUrl = `${this.BASE_ORGANIZATION_URL}/${organizationId}`;
    const response = await this.axiosInstance.get(invitationUrl, { params });
    return response;
  }
}
