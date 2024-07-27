import { ReplySnippet } from '../database/entities/ReplySnippet';
import { Reply } from '../database/entities/Reply';
import { ReplyRepository } from '../database/repositories/ReplyRepository';
import { ThreadRepository } from '../database/repositories/ThreadRepository';
import {
  MULTIPLE_LINE_BREAK_REGEX,
  SINGLE_LINE_BREAK,
  fillUpThreadOrReplyMessageWithSnippet,
  getSnippetTag,
} from './utils/snippetUtils';
import { mapReplyResponse } from './utils/mapperUtils';
import { sendMentionEmailNotification } from './emailNotificationController';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Request, Response } from 'express';
import { RequestSnippetBlot } from 'src/types/types';
import { Thread } from 'src/database/entities/Thread';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const postReply = async (req: Request, res: Response) => {
  const threadId: number = parseInt(req.params.threadId);
  const replyMessage: string = DOMPurify.sanitize(req.body.replyMessage);
  const anonymous: boolean = req.body.anonymous;
  const snippets: RequestSnippetBlot[] = req.body.snippets;
  const delta: any = req.body.delta;
  const mentionedUserIds: number[] = req.body.mentionedUserIds;
  const { updatedReplyMessage, snippetEntities } = await createSnippetEntitiesFromReplyMessage(replyMessage, snippets);
  const thread: Thread | null = await ThreadRepository.findThreadById(threadId);

  if (!thread) {
    res.send({ reply: null });
    return;
  }

  const reply = await Reply.create({
    threadId: threadId,
    message: updatedReplyMessage,
    userId: req.userId,
    anonymous: anonymous,
    delta: delta,
    snippets: snippetEntities,
  }).save();

  sendEmailNotification(thread, req.userId, mentionedUserIds, replyMessage, snippets);
  const replyResponse = await ReplyRepository.findReplyWithPropertiesById(reply.id);
  const response = replyResponse ? mapReplyResponse(replyResponse) : null;

  res.send({ reply: response });
};

const sendEmailNotification = async (
  thread: Thread,
  userId: number,
  mentionedUserIds: number[],
  replyMessage: string,
  snippets: RequestSnippetBlot[]
) => {
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

const createSnippetEntitiesFromReplyMessage = async (replyMessage: string, snippetblots: RequestSnippetBlot[]) => {
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

export const getReplies = async (req: Request, res: Response) => {
  const threadId: number = parseInt(req.params.threadId);
  const replies = await ReplyRepository.findRepliesWithPropertiesByThreadId(threadId);
  const response = replies.map(mapReplyResponse);
  res.send({ replies: response });
};

export const updateReplyMessage = async (req: Request, res: Response) => {
  const replyId: number = parseInt(req.params.id as string);
  const replyMessage: string = DOMPurify.sanitize(req.body.message);
  const snippets: RequestSnippetBlot[] = req.body.snippets;
  const delta: any = req.body.delta;

  const reply = await ReplyRepository.findReplyWithPropertiesById(replyId);

  if (!reply) {
    res.send({ reply: null });
    return;
  }

  reply.snippets.forEach((snippet) => snippet.remove());
  const { updatedReplyMessage, snippetEntities } = await createSnippetEntitiesFromReplyMessage(replyMessage, snippets);

  reply.message = updatedReplyMessage;
  reply.snippets = snippetEntities;
  reply.delta = delta;
  await reply.save();

  const replyResponse = await ReplyRepository.findReplyWithPropertiesById(replyId);
  const response = replyResponse ? mapReplyResponse(replyResponse) : null;
  res.send({ reply: response });
};

export const deleteReply = async (req: Request, res: Response) => {
  const replyId: number = parseInt(req.params.id as string);

  const reply = await ReplyRepository.findReplyWithPropertiesById(replyId);

  if (!reply) {
    res.send({ reply: null });
    return;
  }

  await reply.remove();

  res.send({
    reply: {
      id: replyId,
    },
  });
};
