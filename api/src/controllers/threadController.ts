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
import { ProjectRepository } from '../database/repositories/ProjectRepository';
import { Project } from '../database/entities/Project';
import { ThreadCreateDTO } from '../../../shared/types/ThreadCreateDTO';
import { SnippetRequestDTO } from '../../../shared/types/SnippetRequestDTO';
import { ThreadUpdateDTO } from '../../../shared/types/ThreadUpdateDTO';
import { ThreadResponseDTO } from '../../../shared/types/ThreadResponseDTO';
import { ThreadDeleteResponseDTO } from '../../../shared/types/ThreadDeleteResponseDTO';
import { ThreadSearchDTO } from '../../../shared/types/ThreadSearchDTO';
import { ParamsDictionary } from '../types/ParamsDictionary';
import { ThreadGetQueryDTO } from '../../../shared/types/ThreadGetQueryDTO';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const postThread = async (
  req: Request<ParamsDictionary, ThreadResponseDTO, ThreadCreateDTO>,
  res: Response<ThreadResponseDTO>
) => {
  const title: string = DOMPurify.sanitize(req.body.title);
  const threadMessage: string = DOMPurify.sanitize(req.body.message);
  const filePath: string | undefined = req.body.filePath ? DOMPurify.sanitize(req.body.filePath) : undefined;
  const gitBranch: string | undefined = req.body.gitBranch ? DOMPurify.sanitize(req.body.gitBranch) : undefined;
  const snippets: SnippetRequestDTO[] = req.body.snippets;
  const delta: any = req.body.delta;
  const userId: number | undefined = req.userId;
  const projectId: number = parseInt(req.params.projectId);

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

  if (userId && mentionedUserIds.length > 0) {
    sendMentionEmailNotification(
      userId,
      mentionedUserIds,
      projectId,
      fillUpThreadOrReplyMessageWithSnippet(threadMessage, snippets),
      anonymousPost
    );
  }

  const threadResponse: Thread = await ThreadRepository.findThreadWithPropertiesByThreadId(thread.id);
  const project: Project = await ProjectRepository.findProjectById(projectId);
  ThreadRepository.updateSearchEmbeddingsForThread(threadResponse);
  const response = mapThreadResponse(threadResponse, project, userId);

  res.send(response);
};

const createSnippetEntitiesFromThreadMessage = async (threadMessage: string, snippetblots: SnippetRequestDTO[]) => {
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

export const getThreads = async (
  req: Request<ParamsDictionary, ThreadResponseDTO[], {}, ThreadGetQueryDTO>,
  res: Response<ThreadResponseDTO[]>
) => {
  const filePath: string = req.query.filePath;
  const projectId: number = parseInt(req.params.projectId);

  const userId: number | undefined = req.userId;
  let threads: Thread[];

  if (filePath) {
    threads = await ThreadRepository.findThreadByFilePathAndProjectId(filePath, projectId);
  } else {
    threads = await ThreadRepository.findAllThreadsByProjectId(projectId);
  }

  const project: Project = await ProjectRepository.findProjectById(projectId);
  const response: ThreadResponseDTO[] = threads.map((thread) => mapThreadResponse(thread, project, userId));
  res.send(response);
};

export const getThread = async (
  req: Request<ParamsDictionary, ThreadResponseDTO, {}>,
  res: Response<ThreadResponseDTO>
) => {
  const threadId: number = parseInt(req.params.threadId);
  const projectId: number = parseInt(req.params.projectId);
  const userId: number | undefined = req.userId;

  const thread: Thread = await ThreadRepository.findThreadWithPropertiesByThreadId(threadId);
  const project: Project = await ProjectRepository.findProjectById(projectId);
  const threadDTO = mapThreadResponse(thread, project, userId);

  res.send(threadDTO);
};

export const updateThread = async (
  req: Request<ParamsDictionary, ThreadResponseDTO, ThreadUpdateDTO>,
  res: Response<ThreadResponseDTO>
) => {
  const threadId: number = parseInt(req.params.threadId);
  const title: string = DOMPurify.sanitize(req.body.title);
  const threadMessage: string = DOMPurify.sanitize(req.body.message);
  const snippets: any[] = req.body.snippets;
  const delta: any = req.body.delta;
  const projectId: number = parseInt(req.params.projectId);
  const userId: number | undefined = req.userId;

  const thread: Thread = await ThreadRepository.findThreadWithPropertiesByThreadId(threadId);

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

  const threadResponse: Thread = await ThreadRepository.findThreadWithPropertiesByThreadId(threadId);
  ThreadRepository.updateSearchEmbeddingsForThread(threadResponse);

  const project: Project = await ProjectRepository.findProjectById(projectId);
  const response: ThreadResponseDTO = mapThreadResponse(threadResponse, project, userId);

  res.send(response);
};

export const deleteThread = async (req: Request<ParamsDictionary, {}>, res: Response<ThreadDeleteResponseDTO>) => {
  const threadId: number = parseInt(req.params.threadId as string);

  const thread: Thread = await ThreadRepository.findThreadById(threadId);
  await thread.remove();

  res.send({
    id: threadId,
  });
};

export const searchThreads = async (
  req: Request<ParamsDictionary, ThreadResponseDTO[]>,
  res: Response<ThreadResponseDTO[]>
) => {
  const searchText: string = DOMPurify.sanitize(req.query.searchText as string);
  const projectId: number = parseInt(req.params.projectId as string);
  const userId: number | undefined = req.userId;

  console.log(req.query.searchText);

  let searchResults: Array<Thread> = [];

  if (searchText) {
    searchResults = await ThreadRepository.searchThreads(searchText, projectId);
  }

  const project: Project = await ProjectRepository.findProjectById(projectId);
  const response: ThreadResponseDTO[] = searchResults.map((thread) => mapThreadResponse(thread, project, userId));

  res.send(response);
};
