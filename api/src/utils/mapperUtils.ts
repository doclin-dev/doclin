import { Reply } from 'src/database/entities/Reply';
import { ReplySnippet } from 'src/database/entities/ReplySnippet';
import { Thread } from 'src/database/entities/Thread';
import { ThreadSnippet } from 'src/database/entities/ThreadSnippet';
import { User } from 'src/database/entities/User';
import { SnippetDTO } from '../../../shared/types/SnippetResponseDTO';
import { ReplyDTO } from '../../../shared/types/ReplyDTO';
import { ThreadResponseDTO } from '../../../shared/types/ThreadResponseDTO';
import { UserDTO } from '../../../shared/types/UserDTO';

const ANONYMOUS_USER: string = 'Anonymous User';

export const mapThreadResponse = (thread: Thread): ThreadResponseDTO => {
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
    replies: thread.replies?.map(mapReplyResponse),
  };
};

export const mapReplyResponse = (reply: Reply): ReplyDTO => {
  return {
    id: reply.id,
    message: reply.message,
    username: reply.anonymous ? ANONYMOUS_USER : reply.user?.name,
    createdAt: reply.createdAt,
    snippets: reply.snippets?.map(mapSnippetResponse),
    delta: reply.delta,
  };
};

export const mapSnippetResponse = (snippet: ThreadSnippet | ReplySnippet): SnippetDTO => {
  return {
    id: snippet.id,
    text: snippet.text,
    filePath: snippet.filePath,
    lineStart: snippet.lineStart,
    gitBranch: snippet.gitBranch,
  };
};

export const mapUser = (user: User): UserDTO => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};
