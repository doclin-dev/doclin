import { AbstracApiService } from './AbstractApiService';

export class ProjectApiService extends AbstracApiService {
  private getBaseProjectUrl(organizationId: string) {
    return `/organizations/${organizationId}/projects`;
  }

  public async getProjects(organizationId: string) {
    const baseProjectUrl = this.getBaseProjectUrl(organizationId);

    const response = await this.axiosInstance.get(baseProjectUrl);

    return response;
  }

  public async postProject(organizationId: string, name: string, privateProject: boolean) {
    const data = {
      name: name,
      privateProject: privateProject,
    };

    const baseProjectUrl = this.getBaseProjectUrl(organizationId);
    const response = await this.axiosInstance.post(baseProjectUrl, data);

    return response;
  }

  public async getProject(projectId: number, organizationId: string) {
    const baseProjectUrl = this.getBaseProjectUrl(organizationId);

    const response = await this.axiosInstance.get(`${baseProjectUrl}/${projectId}`);

    return response;
  }
}
