import { ThreadResponseDTO } from '../types/ThreadResponseDTO';
import { ThreadCreateDTO } from '../types/ThreadCreateDTO';
import { AxiosResponse } from 'axios';
import { ThreadUpdateDTO } from '../types/ThreadUpdateDTO';
import { ThreadGetQueryDTO } from '../types/ThreadGetQueryDTO';
import { AbstracApiService } from './AbstractApiService';

export class ThreadApiService extends AbstracApiService {
  private getBaseThreadUrl(organizationId: string, projectId: number) {
    return `/organizations/${organizationId}/projects/${projectId}/threads`;
  }

  public async getAllThreads(organizationId: string, projectId: number): Promise<AxiosResponse<ThreadResponseDTO[]>> {
    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO[]> = await this.axiosInstance.get(baseThreadUrl);
    return response;
  }

  public async getThreadsByFilePath(
    organizationId: string,
    projectId: number,
    filePath: string
  ): Promise<AxiosResponse<ThreadResponseDTO[]>> {
    const params: ThreadGetQueryDTO = {
      filePath: filePath,
    };

    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO[]> = await this.axiosInstance.get(baseThreadUrl, { params });
    return response;
  }

  public async getThread(
    threadId: number,
    projectId: number,
    organizationId: string
  ): Promise<AxiosResponse<ThreadResponseDTO>> {
    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO> = await this.axiosInstance.get(`${baseThreadUrl}/${threadId}`);
    return response;
  }

  public async deleteThread(
    organizationId: string,
    projectId: number,
    threadId: number
  ): Promise<AxiosResponse<ThreadResponseDTO>> {
    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO> = await this.axiosInstance.delete(`${baseThreadUrl}/${threadId}`);
    return response;
  }

  public async postThread(
    organizationId: string,
    projectId: number,
    data: ThreadCreateDTO
  ): Promise<AxiosResponse<ThreadResponseDTO>> {
    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO> = await this.axiosInstance.post(baseThreadUrl, data);
    return response;
  }

  public async updateThread(
    organizationId: string,
    projectId: number,
    threadId: number,
    data: ThreadUpdateDTO
  ): Promise<AxiosResponse<ThreadResponseDTO>> {
    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO> = await this.axiosInstance.put(
      `${baseThreadUrl}/${threadId}`,
      data
    );
    return response;
  }

  public async searchThreads(
    searchText: string,
    projectId: number,
    organizationId: string
  ): Promise<AxiosResponse<ThreadResponseDTO[]>> {
    const params = {
      searchText: searchText,
    };

    const baseThreadUrl = this.getBaseThreadUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadResponseDTO[]> = await this.axiosInstance.get(`${baseThreadUrl}/search`, {
      params,
    });
    return response;
  }
}
