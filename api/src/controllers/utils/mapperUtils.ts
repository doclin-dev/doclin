import { Project } from 'src/database/entities/Project';
import { Reply } from 'src/database/entities/Reply';
import { ReplySnippet } from 'src/database/entities/ReplySnippet';
import { Thread } from 'src/database/entities/Thread';
import { ThreadSnippet } from 'src/database/entities/ThreadSnippet';
import { User } from 'src/database/entities/User';

const ANONYMOUS_USER: string = 'Anonymous User';

export const mapThreadResponse = (thread: Thread, project: Project, userId: number | undefined) => {
  return {
    id: thread.id,
    title: thread.title,
    message: thread.message,
    username: thread.anonymous ? ANONYMOUS_USER : thread.user?.name,
    replyCount: thread.replyCount,
    createdAt: thread.createdAt,
    lastReplied: thread.replies?.length > 0 ? thread.replies[0].createdAt : null,
    snippets: thread.snippets?.map(mapSnippetResponse),
    delta: thread.delta,
    filePath: thread.filePath,
    gitBranch: thread.gitBranch,
    replies: thread.replies?.map((reply) => mapReplyResponse(reply, project, userId)),
    canEdit: project.privateProject || thread.userId === userId,
  };
};

export const mapReplyResponse = (reply: Reply, project: Project, userId: number | undefined) => {
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

export const mapSnippetResponse = (snippet: ThreadSnippet | ReplySnippet) => {
  return {
    id: snippet.id,
    text: snippet.text,
    filePath: snippet.filePath,
    lineStart: snippet.lineStart,
    gitBranch: snippet.gitBranch,
  };
};

export const mapUser = (user: User) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};
