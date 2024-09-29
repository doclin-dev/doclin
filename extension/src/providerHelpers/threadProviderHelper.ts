import * as vscode from 'vscode';
import { PostThread, Thread, UpdateThread } from '../types';
import { getGitBranch } from '../utils/gitProviderUtil';
import { getDoclinRelativeFilePath } from './doclinRelativeFilePath';
import { readDoclinFile } from './doclinFile/readDoclinFile';
import AllThreadsCacheManager from '../utils/cache/AllThreadsCacheManager';
import FileThreadCacheManager from '../utils/cache/FileThreadsCacheManager';
import { ThreadResponseDTO } from '$shared/types/ThreadResponseDTO';
import { mapThreadResponseDTOToThread } from '../mappers/threadResponseDTOToThreadMapper';
import { ThreadCreateDTO } from '$shared/types/ThreadCreateDTO';
import { ThreadUpdateDTO } from '$shared/types/ThreadUpdateDTO';
import { apiService } from '../apiService';

export const getThreadsByActiveFilePath = async (): Promise<{
  threads: Thread[];
  activeFilePath: string;
}> => {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const threads = await getThreadsByFilePath(editor.document.uri);

    return {
      threads,
      activeFilePath: await getDoclinRelativeFilePath(editor.document.uri),
    };
  }

  return { threads: [], activeFilePath: '' };
};

export const getThreadsByFilePath = async (documentUri: vscode.Uri): Promise<Thread[]> => {
  const fileThreadCacheManager = new FileThreadCacheManager();
  const cachedThreads = await fileThreadCacheManager.get(documentUri.fsPath);

  let threadDTOs: ThreadResponseDTO[] = [];

  if (cachedThreads) {
    threadDTOs = cachedThreads;
  } else {
    const doclinFile = await readDoclinFile();
    const organizationId = doclinFile?.organizationId;
    const projectId = doclinFile?.projectId;

    if (organizationId && projectId) {
      const filePath = await getDoclinRelativeFilePath(documentUri);
      threadDTOs = (await apiService.thread.getThreadsByFilePath(organizationId, projectId, filePath))?.data;
      await fileThreadCacheManager.set(documentUri.fsPath, threadDTOs);
    }
  }

  const threadsPromise: Promise<Thread>[] = threadDTOs.map((threadDTO) => mapThreadResponseDTOToThread(threadDTO));
  const threads: Thread[] = await Promise.all(threadsPromise);
  return threads;
};

export const getAllThreads = async (): Promise<Thread[]> => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile.organizationId;
  const projectId = doclinFile.projectId;

  if (!organizationId || !projectId) {
    return [];
  }

  const allThreadsCacheManager = new AllThreadsCacheManager();
  const cachedThreads = await allThreadsCacheManager.get(projectId);

  if (cachedThreads) {
    return cachedThreads;
  }

  return await apiFetchAllThreads(organizationId, projectId);
};

const apiFetchAllThreads = async (organizationId: string, projectId: number): Promise<Thread[]> => {
  try {
    const response = await apiService.thread.getAllThreads(organizationId, projectId);
    const threadDTOs: ThreadResponseDTO[] = response?.data;

    const threadsPromise: Promise<Thread>[] = threadDTOs.map((threadDTO) => mapThreadResponseDTOToThread(threadDTO));
    const threads: Thread[] = await Promise.all(threadsPromise);

    const allThreadsCacheManager = new AllThreadsCacheManager();
    await allThreadsCacheManager.set(projectId, threads);

    return threads;
  } catch (error) {
    vscode.window.showErrorMessage(`Error fetching threads. ${error}`);
    return [];
  }
};

export const postThread = async ({
  title,
  threadMessage,
  delta,
  snippets,
  mentionedUserIds,
  anonymous,
  isFileThreadSelected,
}: PostThread): Promise<Thread | undefined> => {
  try {
    const doclinFile = await readDoclinFile();
    const organizationId = doclinFile.organizationId;
    const projectId = doclinFile.projectId;
    const activeEditorUri = vscode.window.activeTextEditor?.document.uri;
    const filePath =
      activeEditorUri && isFileThreadSelected ? await getDoclinRelativeFilePath(activeEditorUri) : undefined;
    const gitBranch = isFileThreadSelected ? await getGitBranch() : undefined;

    if (!organizationId || !projectId) {
      return;
    }

    const data: ThreadCreateDTO = {
      title: title,
      message: threadMessage,
      delta: delta,
      snippets: snippets,
      gitBranch: gitBranch,
      filePath: filePath,
      mentionedUserIds: mentionedUserIds,
      anonymous: anonymous,
    };

    const response = await apiService.thread.postThread(organizationId, projectId, data);
    const threadDTO: ThreadResponseDTO = response?.data;
    const thread: Thread = await mapThreadResponseDTOToThread(threadDTO);

    if (activeEditorUri) {
      const fileThreadCacheManager = new FileThreadCacheManager();
      await fileThreadCacheManager.clear(activeEditorUri.fsPath);
    }

    const allThreadsCacheManager = new AllThreadsCacheManager();
    await allThreadsCacheManager.clear(projectId);

    return thread;
  } catch (error) {
    vscode.window.showErrorMessage(`Error posting thread. ${error}`);
  }
};

export const updateThread = async ({
  title,
  threadMessage,
  threadId,
  snippets,
  delta,
}: UpdateThread): Promise<Thread | undefined> => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile.organizationId;
  const projectId = doclinFile.projectId;
  const activeEditorUri = vscode.window.activeTextEditor?.document.uri;

  if (!organizationId || !projectId) {
    return;
  }

  const data: ThreadUpdateDTO = {
    title: title,
    message: threadMessage,
    delta: delta,
    snippets: snippets,
  };

  const response = await apiService.thread.updateThread(organizationId, projectId, threadId, data);
  const threadDTO: ThreadResponseDTO = response?.data;
  const thread: Thread = await mapThreadResponseDTOToThread(threadDTO);

  if (activeEditorUri) {
    const fileThreadCacheManager = new FileThreadCacheManager();
    await fileThreadCacheManager.clear(activeEditorUri.fsPath);
  }

  const allThreadsCacheManager = new AllThreadsCacheManager();
  await allThreadsCacheManager.clear(projectId);

  return thread;
};

export const deleteThread = async ({ threadId }: { threadId: number }) => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile.organizationId;
  const projectId = doclinFile.projectId;
  const activeEditorUri = vscode.window.activeTextEditor?.document.uri;

  if (!organizationId || !projectId) {
    return;
  }

  const response = await apiService.thread.deleteThread(organizationId, projectId, threadId);
  const thread: ThreadResponseDTO = response?.data;

  if (activeEditorUri) {
    const fileThreadCacheManager = new FileThreadCacheManager();
    await fileThreadCacheManager.clear(activeEditorUri.fsPath);
  }

  const allThreadsCacheManager = new AllThreadsCacheManager();
  await allThreadsCacheManager.clear(projectId);

  return thread;
};

export const searchThreads = async ({ searchText }: { searchText: string }): Promise<Thread[] | undefined> => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile.organizationId ?? '';
  const projectId = doclinFile.projectId;

  if (!organizationId || !projectId) {
    return;
  }

  const response = await apiService.thread.searchThreads(searchText, projectId, organizationId);
  const threadDTOs: ThreadResponseDTO[] = response.data;
  const threadsPromise: Promise<Thread>[] = threadDTOs.map((threadDTO) => mapThreadResponseDTOToThread(threadDTO));
  const threads: Thread[] = await Promise.all(threadsPromise);

  return threads;
};
