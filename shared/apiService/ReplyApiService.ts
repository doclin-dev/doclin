import { AxiosResponse } from 'axios';
import { ReplyCreateDTO } from '../types/ReplyCreateDTO';
import { ReplyResponseDTO } from '../types/ReplyResponseDTO';
import { SnippetRequestDTO } from '../types/SnippetRequestDTO';
import { ThreadDeleteResponseDTO } from '../types/ThreadDeleteResponseDTO';
import { AbstracApiService } from './AbstractApiService';

export class ReplyApiService extends AbstracApiService {
  private getBaseReplyUrl(organizationId: string, projectId: number, threadId: number | undefined = undefined): string {
    return `/organizations/${organizationId}/projects/${projectId}/threads/${threadId}/replies`;
  }

  public async getReplies(organizationId: string, projectId: number, threadId: number) {
    const baseReplyUrl = this.getBaseReplyUrl(organizationId, projectId, threadId);
    const response: AxiosResponse<ReplyResponseDTO[]> = await this.axiosInstance.get(baseReplyUrl);
    return response;
  }

  public async postReply(organizationId: string, projectId: number, threadId: number, data: ReplyCreateDTO) {
    const baseReplyUrl = this.getBaseReplyUrl(organizationId, projectId, threadId);
    const response: AxiosResponse<ReplyResponseDTO> = await this.axiosInstance.post(baseReplyUrl, data);
    return response;
  }

  public async updateReply(
    organizationId: string,
    projectId: number,
    replyId: number,
    threadMessage: string,
    snippets: SnippetRequestDTO[],
    delta: any[]
  ) {
    const data = {
      message: threadMessage,
      snippets: snippets,
      delta: delta,
    };

    const baseReplyUrl = this.getBaseReplyUrl(organizationId, projectId);
    const response: AxiosResponse<ReplyResponseDTO> = await this.axiosInstance.put(`${baseReplyUrl}/${replyId}`, data);
    return response;
  }

  public async deleteReply(organizationId: string, projectId: number, replyId: number) {
    const baseReplyUrl = this.getBaseReplyUrl(organizationId, projectId);
    const response: AxiosResponse<ThreadDeleteResponseDTO> = await this.axiosInstance.delete(
      `${baseReplyUrl}/${replyId}`
    );
    return response;
  }
}
