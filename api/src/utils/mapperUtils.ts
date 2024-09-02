import { Project } from '../database/entities/Project';
import { Reply } from '../database/entities/Reply';
import { ReplySnippet } from '../database/entities/ReplySnippet';
import { Thread } from '../database/entities/Thread';
import { ThreadSnippet } from '../database/entities/ThreadSnippet';
import { SnippetResponseDTO } from '../../../shared/types/SnippetResponseDTO';
import { ReplyResponseDTO } from '../../../shared/types/ReplyResponseDTO';
import { ThreadResponseDTO } from '../../../shared/types/ThreadResponseDTO';

const ANONYMOUS_USER: string = 'Anonymous User';

export const mapThreadResponse = (thread: Thread, project: Project, userId: number | undefined): ThreadResponseDTO => {
  return {
    id: thread.id,
    title: thread.title,
    message: thread.message,
    username: thread.anonymous ? ANONYMOUS_USER : thread.user?.name,
    replyCount: thread.replyCount,
    createdAt: thread.createdAt,
    lastReplied: thread.replies?.length > 0 ? thread.replies[0].createdAt : undefined,
    snippets: thread.snippets?.map(mapSnippetResponse),
    delta: thread.delta,
    filePath: thread.filePath,
    gitBranch: thread.gitBranch,
    replies: thread.replies?.map((reply) => mapReplyResponse(reply, project, userId)),
    canEdit: project.privateProject || thread.userId === userId,
  };
};

export const mapReplyResponse = (reply: Reply, project: Project, userId: number | undefined): ReplyResponseDTO => {
  return {
    id: reply.id,
    message: reply.message,
    username: reply.anonymous ? ANONYMOUS_USER : reply.user?.name,
    createdAt: reply.createdAt,
    snippets: reply.snippets?.map(mapSnippetResponse),
    delta: reply.delta,
    canEdit: project.privateProject || reply.userId === userId,
  };
};

export const mapSnippetResponse = (snippet: ThreadSnippet | ReplySnippet): SnippetResponseDTO => {
  return {
    id: snippet.id,
    text: snippet.text,
    filePath: snippet.filePath,
    lineStart: snippet.lineStart,
    gitBranch: snippet.gitBranch,
  };
};
