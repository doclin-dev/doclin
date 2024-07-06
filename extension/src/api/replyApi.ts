import { createAxiosInstance } from './apiService';

const getBaseReplyUrl = async (
  organizationId: string,
  projectId: number,
  threadId: number | undefined = undefined
): Promise<string> => {
  return `/organizations/${organizationId}/projects/${projectId}/threads/${threadId}/replies`;
};

const getReplies = async (organizationId: string, projectId: number, threadId: number) => {
  const apiService = await createAxiosInstance();
  const baseReplyUrl = await getBaseReplyUrl(organizationId, projectId, threadId);
  const response = await apiService.get(baseReplyUrl);

  return response;
};

const postReply = async (
  organizationId: string,
  projectId: number,
  replyMessage: string,
  threadId: number,
  anonymous: boolean,
  snippets: any[],
  delta: any[],
  mentionedUserIds: number[]
) => {
  const data = {
    replyMessage: replyMessage,
    anonymous: anonymous,
    snippets: snippets,
    delta: delta,
    mentionedUserIds: mentionedUserIds,
  };

  const apiService = await createAxiosInstance();
  const baseReplyUrl = await getBaseReplyUrl(organizationId, projectId, threadId);
  const response = await apiService.post(baseReplyUrl, data);

  return response;
};

const updateReply = async (
  organizationId: string,
  projectId: number,
  replyId: number,
  threadMessage: string,
  snippets: any[],
  delta: any[]
) => {
  const data = {
    message: threadMessage,
    snippets: snippets,
    delta: delta,
  };

  const apiService = await createAxiosInstance();
  const baseReplyUrl = await getBaseReplyUrl(organizationId, projectId);
  const response = await apiService.put(`${baseReplyUrl}/${replyId}`, data);

  return response;
};

const deleteReply = async (organizationId: string, projectId: number, replyId: number) => {
  const apiService = await createAxiosInstance();
  const baseReplyUrl = await getBaseReplyUrl(organizationId, projectId);
  const response = await apiService.delete(`${baseReplyUrl}/${replyId}`);

  return response;
};

export default {
  getReplies,
  postReply,
  updateReply,
  deleteReply,
};
