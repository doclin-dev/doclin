import { AxiosResponse } from 'axios';
import { AbstracApiService } from './AbstractApiService';
import { ProjectDTO } from '../types/ProjectDTO';

export class ProjectApiService extends AbstracApiService {
  private getBaseProjectUrl(organizationId: string) {
    return `/organizations/${organizationId}/projects`;
  }

  public async getProjects(organizationId: string): Promise<AxiosResponse<ProjectDTO[]>> {
    const baseProjectUrl: string = this.getBaseProjectUrl(organizationId);
    const response: AxiosResponse<ProjectDTO[]> = await this.axiosInstance.get(baseProjectUrl);
    return response;
  }

  public async postProject(
    organizationId: string,
    name: string,
    privateProject: boolean
  ): Promise<AxiosResponse<ProjectDTO>> {
    const data = {
      name: name,
      privateProject: privateProject,
    };

    const baseProjectUrl: string = this.getBaseProjectUrl(organizationId);
    const response: AxiosResponse<ProjectDTO> = await this.axiosInstance.post(baseProjectUrl, data);
    return response;
  }

  public async getProject(projectId: number, organizationId: string): Promise<AxiosResponse<ProjectDTO>> {
    const baseProjectUrl = this.getBaseProjectUrl(organizationId);
    const response: AxiosResponse<ProjectDTO> = await this.axiosInstance.get(`${baseProjectUrl}/${projectId}`);
    return response;
  }
}
