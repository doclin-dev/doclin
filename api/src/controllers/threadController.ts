import { RequestSnippetBlot } from 'src/types/types';
import { Thread } from '../database/entities/Thread';
import { ThreadSnippet } from '../database/entities/ThreadSnippet';
import { ThreadRepository } from '../database/repositories/ThreadRepository';
import { sendMentionEmailNotification } from './emailNotificationController';
import { mapThreadResponse } from '../utils/mapperUtils';
import {
  MULTIPLE_LINE_BREAK_REGEX,
  SINGLE_LINE_BREAK,
  fillUpThreadOrReplyMessageWithSnippet,
  getSnippetTag,
} from '../utils/snippetUtils';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Request, Response } from 'express';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const postThread = async (req: Request, res: Response) => {
  const title: string = DOMPurify.sanitize(req.body.title);
  const threadMessage: string = DOMPurify.sanitize(req.body.threadMessage);
  const filePath: string = DOMPurify.sanitize(req.body.filePath);
  const gitBranch: string = DOMPurify.sanitize(req.body.gitBranch);
  const snippets: RequestSnippetBlot[] = req.body.snippets;
  const delta: any = req.body.delta;
  const userId: number = req.userId;
  const projectId: number = req.body.projectId;
  const anonymousPost: boolean = req.body.anonymous;
  const mentionedUserIds: number[] = req.body.mentionedUserIds;

  const { updatedThreadMessage, snippetEntities } = await createSnippetEntitiesFromThreadMessage(
    threadMessage,
    snippets
  );

  const thread = await ThreadRepository.create({
    title: title,
    message: updatedThreadMessage,
    userId: userId,
    projectId: projectId,
    snippets: snippetEntities,
    anonymous: anonymousPost,
    delta: delta,
    filePath: filePath,
    gitBranch: gitBranch,
  }).save();

  if (mentionedUserIds.length > 0) {
    sendMentionEmailNotification(
      req.userId,
      mentionedUserIds,
      projectId,
      fillUpThreadOrReplyMessageWithSnippet(threadMessage, snippets)
    );
  }

  const threadResponse = await ThreadRepository.findThreadWithPropertiesByThreadId(thread.id);

  if (threadResponse) {
    await ThreadRepository.updateSearchEmbeddingsForThread(threadResponse);
  }

  const response = threadResponse ? mapThreadResponse(threadResponse) : null;
  res.send({ thread: response });
};

const createSnippetEntitiesFromThreadMessage = async (threadMessage: string, snippetblots: RequestSnippetBlot[]) => {
  let updatedThreadMessage: string = threadMessage.replace(MULTIPLE_LINE_BREAK_REGEX, SINGLE_LINE_BREAK);
  const snippetEntities: ThreadSnippet[] = [];

  for (const snippetblot of snippetblots) {
    const snippet: ThreadSnippet = await ThreadSnippet.create({
      text: snippetblot.originalSnippet,
      filePath: snippetblot.filePath,
      lineStart: snippetblot.lineStart,
      gitBranch: snippetblot.gitBranch,
    }).save();

    snippetEntities.push(snippet);
    updatedThreadMessage = updatedThreadMessage.replace(getSnippetTag(snippetblot.index), getSnippetTag(snippet.id));
  }

  return { updatedThreadMessage, snippetEntities };
};

export const getThreads = async (req: Request, res: Response) => {
  const filePath: string = req.query.filePath as string;
  const projectId: number = parseInt(req.query.projectId as string);
  let threads: Thread[];

  if (filePath) {
    threads = await ThreadRepository.findThreadByFilePathAndProjectId(filePath, projectId);
  } else {
    threads = await ThreadRepository.findAllThreadsByProjectId(projectId);
  }

  const response = threads.map(mapThreadResponse);

  res.send({ threads: response });
};

export const updateThread = async (req: Request, res: Response) => {
  const threadId: number = parseInt(req.params.id as string);
  const title: string = DOMPurify.sanitize(req.body.title);
  const threadMessage: string = DOMPurify.sanitize(req.body.message);
  const snippets: any[] = req.body.snippets;
  const delta: any = req.body.delta;

  const thread: Thread | null = await ThreadRepository.findThreadWithPropertiesByThreadId(threadId);

  if (!thread) {
    res.send({ thread: null });
    return;
  }

  thread.snippets.forEach((snippet) => snippet.remove());

  const { updatedThreadMessage, snippetEntities } = await createSnippetEntitiesFromThreadMessage(
    threadMessage,
    snippets
  );

  thread.title = title;
  thread.message = updatedThreadMessage;
  thread.snippets = snippetEntities;
  thread.delta = delta;
  await thread.save();

  const threadResponse = await ThreadRepository.findThreadWithPropertiesByThreadId(threadId);

  if (threadResponse) {
    await ThreadRepository.updateSearchEmbeddingsForThread(threadResponse);
  }

  const response = threadResponse ? mapThreadResponse(threadResponse) : null;
  res.send({ thread: response });
};

export const deleteThread = async (req: Request, res: Response) => {
  const threadId: number = parseInt(req.params.id as string);

  const thread = await ThreadRepository.findThreadById(threadId);

  if (!thread) {
    res.send({ thread: null });
    return;
  }

  await thread.remove();

  res.send({
    thread: {
      id: threadId,
    },
  });
};
