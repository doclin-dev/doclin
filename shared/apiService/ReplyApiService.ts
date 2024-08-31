import { SnippetRequestDTO } from '../types/SnippetRequestDTO';
import { AbstracApiService } from './AbstractApiService';

export class ReplyApiService extends AbstracApiService {
  private getBaseReplyUrl(organizationId: string, projectId: number, threadId: number | undefined = undefined): string {
    return `/organizations/${organizationId}/projects/${projectId}/threads/${threadId}/replies`;
  }

  public async getReplies(organizationId: string, projectId: number, threadId: number) {
    const baseReplyUrl = this.getBaseReplyUrl(organizationId, projectId, threadId);
    const response = await this.axiosInstance.get(baseReplyUrl);
    return response;
  }

  public async postReply(
    organizationId: string,
    projectId: number,
    replyMessage: string,
    threadId: number,
    anonymous: boolean,
    snippets: SnippetRequestDTO[],
    delta: any[],
    mentionedUserIds: number[]
  ) {
    const data = {
      replyMessage: replyMessage,
      anonymous: anonymous,
      snippets: snippets,
      delta: delta,
      mentionedUserIds: mentionedUserIds,
    };

    const baseReplyUrl = this.getBaseReplyUrl(organizationId, projectId, threadId);
    const response = await this.axiosInstance.post(baseReplyUrl, data);

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
    const response = await this.axiosInstance.put(`${baseReplyUrl}/${replyId}`, data);

    return response;
  }

  public async deleteReply(organizationId: string, projectId: number, replyId: number) {
    const baseReplyUrl = this.getBaseReplyUrl(organizationId, projectId);
    const response = await this.axiosInstance.delete(`${baseReplyUrl}/${replyId}`);

    return response;
  }
}
