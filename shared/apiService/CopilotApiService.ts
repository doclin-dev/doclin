import { AxiosResponse } from 'axios';
import { CopilotRequestDTO } from '../types/CopilotRequestDTO';
import { AbstracApiService } from './AbstractApiService';
import { CopilotResponseDTO } from '../types/CopilotResponseDTO';

export class CopilotApiService extends AbstracApiService {
  private getBaseCopilotUrl(organizationId: string, projectId: number) {
    return `/organizations/${organizationId}/projects/${projectId}/copilot`;
  }

  public async postCopilotPrompt(
    organizationId: string,
    projectId: number,
    data: CopilotRequestDTO
  ): Promise<AxiosResponse<CopilotResponseDTO>> {
    const baseThreadUrl = this.getBaseCopilotUrl(organizationId, projectId);
    const response: AxiosResponse<CopilotResponseDTO> = await this.axiosInstance.post(baseThreadUrl, data);
    return response;
  }
}
