import { ReplySnippet } from '../database/entities/ReplySnippet';
import { Reply } from '../database/entities/Reply';
import { ReplyRepository } from '../database/repositories/ReplyRepository';
import { ThreadRepository } from '../database/repositories/ThreadRepository';
import {
  MULTIPLE_LINE_BREAK_REGEX,
  SINGLE_LINE_BREAK,
  fillUpThreadOrReplyMessageWithSnippet,
  getSnippetTag,
} from '../utils/snippetUtils';
import { mapReplyResponse } from '../utils/mapperUtils';
import { sendMentionEmailNotification } from './emailNotificationController';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Request, Response } from 'express';
import { Thread } from '../database/entities/Thread';
import { ProjectRepository } from '../database/repositories/ProjectRepository';
import { Project } from '../database/entities/Project';
import { SnippetRequestDTO } from '../../../shared/types/SnippetRequestDTO';
import { ParamsDictionary } from 'src/types/ParamsDictionary';
import { ReplyResponseDTO } from '../../../shared/types/ReplyResponseDTO';
import { ReplyCreateDTO } from '../../../shared/types/ReplyCreateDTO';
import { ThreadDeleteResponseDTO } from '../../../shared/types/ThreadDeleteResponseDTO';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const postReply = async (
  req: Request<ParamsDictionary, ReplyResponseDTO, ReplyCreateDTO>,
  res: Response<ReplyResponseDTO>
) => {
  const threadId: number = parseInt(req.params.threadId);
  const replyMessage: string = DOMPurify.sanitize(req.body.message);
  const anonymous: boolean = req.body.anonymous;
  const snippets: SnippetRequestDTO[] = req.body.snippets;
  const delta: any = req.body.delta;
  const mentionedUserIds: number[] = req.body.mentionedUserIds;
  const userId: number | undefined = req.userId;
  const { updatedReplyMessage, snippetEntities } = await createSnippetEntitiesFromReplyMessage(replyMessage, snippets);
  const thread: Thread | null = await ThreadRepository.findThreadById(threadId);
  const projectId: number = parseInt(req.params.projectId as string);

  if (!thread) {
    throw new Error('Thread do not exist');
  }

  const reply = await Reply.create({
    threadId: threadId,
    message: updatedReplyMessage,
    userId: userId,
    anonymous: anonymous,
    delta: delta,
    snippets: snippetEntities,
  }).save();

  const threadWithProperties: Thread = await ThreadRepository.findThreadWithPropertiesByThreadId(threadId);
  await ThreadRepository.updateSearchEmbeddingsForThread(threadWithProperties);

  sendEmailNotification(thread, userId, mentionedUserIds, replyMessage, snippets);
  const replyResponse: Reply = await ReplyRepository.findReplyWithPropertiesById(reply.id);
  const project: Project = await ProjectRepository.findProjectById(projectId);
  const response: ReplyResponseDTO = mapReplyResponse(replyResponse, project, userId);
  res.send(response);
};

const sendEmailNotification = async (
  thread: Thread,
  userId: number | undefined,
  mentionedUserIds: number[],
  replyMessage: string,
  snippets: SnippetRequestDTO[]
) => {
  if (!userId) {
    return;
  }

  const relevantUserIds = (await ThreadRepository.findUsersByThreadId(thread.id))
    .filter((user) => user.id !== userId)
    .map((user) => user.id);

  const allRelevantUserIds = [...new Set([...mentionedUserIds, ...relevantUserIds])];

  if (allRelevantUserIds.length > 0) {
    sendMentionEmailNotification(
      userId,
      allRelevantUserIds,
      thread.projectId,
      fillUpThreadOrReplyMessageWithSnippet(replyMessage, snippets)
    );
  }
};

const createSnippetEntitiesFromReplyMessage = async (replyMessage: string, snippetblots: SnippetRequestDTO[]) => {
  let updatedReplyMessage: string = '';
  updatedReplyMessage = replyMessage.replace(MULTIPLE_LINE_BREAK_REGEX, SINGLE_LINE_BREAK);
  const snippetEntities = [];

  for (const snippetblot of snippetblots) {
    const snippet: ReplySnippet = await ReplySnippet.create({
      text: snippetblot.originalSnippet,
      filePath: snippetblot.filePath,
      lineStart: snippetblot.lineStart,
      gitBranch: snippetblot.gitBranch,
    }).save();

    snippetEntities.push(snippet);
    updatedReplyMessage = updatedReplyMessage.replace(getSnippetTag(snippetblot.index), getSnippetTag(snippet.id));
  }

  return { updatedReplyMessage, snippetEntities };
};

export const getReplies = async (
  req: Request<ParamsDictionary, ReplyResponseDTO[], {}>,
  res: Response<ReplyResponseDTO[]>
) => {
  const threadId: number = parseInt(req.params.threadId);
  const projectId: number = parseInt(req.params.projectId as string);
  const userId: number | undefined = req.userId;

  const replies: Reply[] = await ReplyRepository.findRepliesWithPropertiesByThreadId(threadId);
  const project: Project = await ProjectRepository.findProjectById(projectId);
  const response: ReplyResponseDTO[] = replies.map((reply) => mapReplyResponse(reply, project, userId));
  res.send(response);
};

export const updateReplyMessage = async (
  req: Request<ParamsDictionary, ReplyResponseDTO, ReplyCreateDTO>,
  res: Response<ReplyResponseDTO>
) => {
  const replyId: number = parseInt(req.params.replyId as string);
  const replyMessage: string = DOMPurify.sanitize(req.body.message);
  const snippets: SnippetRequestDTO[] = req.body.snippets;
  const delta: any = req.body.delta;
  const projectId: number = parseInt(req.params.projectId as string);
  const userId: number | undefined = req.userId;

  const reply: Reply = await ReplyRepository.findReplyWithPropertiesById(replyId);

  reply.snippets.forEach((snippet) => snippet.remove());
  const { updatedReplyMessage, snippetEntities } = await createSnippetEntitiesFromReplyMessage(replyMessage, snippets);
  reply.message = updatedReplyMessage;
  reply.snippets = snippetEntities;
  reply.delta = delta;
  await reply.save();

  const threadWithProperties: Thread = await ThreadRepository.findThreadWithPropertiesByThreadId(reply.threadId);
  await ThreadRepository.updateSearchEmbeddingsForThread(threadWithProperties);

  const replyResponse: Reply = await ReplyRepository.findReplyWithPropertiesById(replyId);
  const project: Project = await ProjectRepository.findProjectById(projectId);
  const response: ReplyResponseDTO = mapReplyResponse(replyResponse, project, userId);
  res.send(response);
};

export const deleteReply = async (req: Request<ParamsDictionary, {}>, res: Response<ThreadDeleteResponseDTO>) => {
  const replyId: number = parseInt(req.params.replyId as string);
  const reply: Reply = await ReplyRepository.findReplyWithPropertiesById(replyId);
  await reply.remove();

  res.send({
    id: replyId,
  });
};
