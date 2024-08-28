import { ThreadResponseDTO } from '../types/ThreadResponseDTO';
import { ThreadRequestDTO } from '../types/ThreadRequestDTO';
import { AxiosInstance, AxiosResponse } from 'axios';

export class ThreadApiService {
  private axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  public async getAllThreads(
    organizationId: string,
    projectId: number
  ): Promise<AxiosResponse<ThreadResponseDTO, any>> {
    const params = {
      projectId: projectId,
    };

    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO, any> = await this.axiosInstance.get(baseThreadUrl, { params });
    return response;
  }

  public async getThreadsByFilePath(organizationId: string, projectId: number, filePath: string) {
    const params = {
      projectId: projectId,
      filePath: filePath,
    };

    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO, any> = await this.axiosInstance.get(baseThreadUrl, { params });
    return response;
  }

  public async deleteThread(organizationId: string, projectId: number, threadId: number) {
    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response = await this.axiosInstance.delete(`${baseThreadUrl}/${threadId}`);
    return response;
  }

  public async postThread(organizationId: string, projectId: number, data: ThreadRequestDTO) {
    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO, any> = await this.axiosInstance.post(baseThreadUrl, data);
    return response;
  }

  public async updateThread(organizationId: string, projectId: number, threadId: number, data: ThreadRequestDTO) {
    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO, any> = await this.axiosInstance.put(`${baseThreadUrl}/${threadId}`, data);
    return response;
  }

  private getBaseThreadUrl(organizationId: string, projectId: number) {
    return `/organizations/${organizationId}/projects/${projectId}/threads`;
  }
}
