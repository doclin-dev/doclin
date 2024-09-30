import * as vscode from 'vscode';
import { PostReply, Reply, UpdateReply } from '../types';
import AllThreadsCacheManager from '../utils/cache/AllThreadsCacheManager';
import FileThreadCacheManager from '../utils/cache/FileThreadsCacheManager';
import { readDoclinFile } from './doclinFile/readDoclinFile';
import { apiService } from '../apiService';
import { ReplyResponseDTO } from '$shared/types/ReplyResponseDTO';
import { ReplyCreateDTO } from '$shared/types/ReplyCreateDTO';
import { mapReplyResponseDTOToReply } from '../mappers/replyResponseDTOtoReplyMapper';
import { ThreadDeleteResponseDTO } from '$shared/types/ThreadDeleteResponseDTO';

export const getRepliesByThreadId = async ({ threadId }: { threadId: number }): Promise<any> => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile?.organizationId;
  const projectId = doclinFile?.projectId;

  if (!organizationId || !projectId) {
    return;
  }

  const response = await apiService.reply.getReplies(organizationId, projectId, threadId);
  const replyDTOs: ReplyResponseDTO[] = response?.data;
  const repliesPromise: Promise<Reply>[] = replyDTOs.map(mapReplyResponseDTOToReply);
  const replies = Promise.all(repliesPromise);
  return replies;
};

export const postReply = async ({
  replyMessage,
  threadId,
  anonymous,
  snippets,
  delta,
  mentionedUserIds,
}: PostReply): Promise<any> => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile?.organizationId;
  const projectId = doclinFile?.projectId;

  if (!organizationId || !projectId) {
    return;
  }

  const data: ReplyCreateDTO = {
    message: replyMessage,
    anonymous,
    snippets,
    delta,
    mentionedUserIds,
  };

  const response = await apiService.reply.postReply(organizationId, projectId, threadId, data);
  const replyDTO: ReplyResponseDTO = response?.data;
  const reply = await mapReplyResponseDTOToReply(replyDTO);
  clearThreadsCache(projectId);
  return reply;
};

const clearThreadsCache = async (projectId: number) => {
  const activeEditorUri = vscode.window.activeTextEditor?.document.uri;

  if (activeEditorUri) {
    const fileThreadCacheManager = new FileThreadCacheManager();
    await fileThreadCacheManager.clear(activeEditorUri.fsPath);
  }

  const allThreadsCacheManager = new AllThreadsCacheManager();
  await allThreadsCacheManager.clear(projectId);
};

export const updateReply = async ({ replyMessage, replyId, snippets, delta }: UpdateReply): Promise<any> => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile?.organizationId;
  const projectId = doclinFile?.projectId;

  if (!organizationId || !projectId) {
    return;
  }

  const response = await apiService.reply.updateReply(
    organizationId,
    projectId,
    replyId,
    replyMessage,
    snippets,
    delta
  );

  const replyDTO: ReplyResponseDTO = response?.data;
  const reply: Reply = await mapReplyResponseDTOToReply(replyDTO);
  return reply;
};

export const deleteReply = async ({ replyId }: { replyId: number }) => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile?.organizationId;
  const projectId = doclinFile?.projectId;

  if (!organizationId || !projectId) {
    return;
  }

  const response = await apiService.reply.deleteReply(organizationId, projectId, replyId);
  const reply: ThreadDeleteResponseDTO = response?.data;
  return reply;
};
