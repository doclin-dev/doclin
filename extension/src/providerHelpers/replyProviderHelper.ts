import replyApi from "../api/replyApi";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";

export const getRepliesByThreadId = async ({ threadId }: { threadId: number }): Promise<any> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId) return null;

  const response = await replyApi.getReplies(organizationId, projectId, threadId);
  const payload = response?.data;
  const replies = payload?.replies;

  return replies;
}

export const postReply = async ({ replyMessage, threadId, anonymous }: {replyMessage: string, threadId: number, anonymous: boolean}): Promise<any> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId) return null;

  const response = await replyApi.postReply(organizationId, projectId, replyMessage, threadId, anonymous);
  const reply = response?.data?.reply;

  return reply;
}

export const updateReply = async ({ replyMessage, replyId }: { replyMessage: string, replyId: number }): Promise<any> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId) return null;

  const response = await replyApi.updateReply(organizationId, projectId, replyId, replyMessage);
  const reply = response?.data?.reply;

  return reply;
}

export const deleteReply = async ({ replyId }: { replyId: number }) => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId) return null;

  const response = await replyApi.deleteReply(organizationId, projectId, replyId);
  const reply = response?.data?.reply;

  return reply;
}