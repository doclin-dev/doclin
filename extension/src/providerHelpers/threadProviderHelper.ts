import * as vscode from 'vscode';
import threadApi from '../api/threadApi';
import { compareSnippetsWithActiveEditor } from '../utils/snippetComparisonUtil';
import { PostThread, Thread, UpdateThread } from '../types';
import { getGitBranch } from '../utils/gitProviderUtil';
import { getDoclinRelativeFilePath } from './doclinRelativeFilePath';
import { fillUpThreadOrReplyMessageWithSnippet } from '../utils/fillUpThreadOrReplyMessageWithSnippet';
import { readDoclinFile } from './doclinFile/readDoclinFile';
import AllThreadsCacheManager from '../utils/cache/AllThreadsCacheManager';
import FileThreadCacheManager from '../utils/cache/FileThreadsCacheManager';

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

  let threads: Thread[] = [];

  if (cachedThreads) {
    threads = cachedThreads;
  } else {
    const doclinFile = await readDoclinFile();
    const organizationId = doclinFile?.organizationId;
    const projectId = doclinFile?.projectId;

    if (organizationId && projectId) {
      const filePath = await getDoclinRelativeFilePath(documentUri);
      threads = (await threadApi.getFileBasedThreads(organizationId, projectId, filePath))?.data?.threads;
      await fileThreadCacheManager.set(documentUri.fsPath, threads);
    }
  }

  for (const thread of threads) {
    await compareSnippetsWithActiveEditor(thread.snippets);
    fillUpThreadOrReplyMessageWithSnippet(thread);
  }

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

const apiFetchAllThreads = async (organizationId: string, projectId: number) => {
  const response = await threadApi.getAllThreads(organizationId, projectId);
  const payload = response?.data;
  let threads: Thread[] = payload?.threads;

  for (const thread of threads) {
    await compareSnippetsWithActiveEditor(thread.snippets);
    fillUpThreadOrReplyMessageWithSnippet(thread);
  }

  const allThreadsCacheManager = new AllThreadsCacheManager();
  await allThreadsCacheManager.set(projectId, threads);

  return threads;
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
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile.organizationId;
  const projectId = doclinFile.projectId;
  const activeEditorUri = vscode.window.activeTextEditor?.document.uri;
  const activeEditorDoclinRelativePath = activeEditorUri ? await getDoclinRelativeFilePath(activeEditorUri) : null;
  const gitBranch = await getGitBranch();

  if (!organizationId || !projectId) {
    return;
  }

  const response = await threadApi.postThread(
    organizationId,
    projectId,
    title,
    threadMessage,
    delta,
    snippets,
    isFileThreadSelected ? gitBranch : null,
    isFileThreadSelected ? activeEditorDoclinRelativePath : null,
    mentionedUserIds,
    anonymous
  );

  const thread: Thread = response?.data?.thread;

  await compareSnippetsWithActiveEditor(thread.snippets);
  fillUpThreadOrReplyMessageWithSnippet(thread);

  if (activeEditorUri) {
    const fileThreadCacheManager = new FileThreadCacheManager();
    await fileThreadCacheManager.clear(activeEditorUri.fsPath);
  }

  const allThreadsCacheManager = new AllThreadsCacheManager();
  await allThreadsCacheManager.clear(projectId);

  return thread;
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
  const activeEditorDoclinRelativePath = activeEditorUri ? await getDoclinRelativeFilePath(activeEditorUri) : null;

  if (!organizationId || !projectId) {
    return;
  }

  const response = await threadApi.updateThread(
    organizationId,
    projectId,
    threadId,
    title,
    threadMessage,
    delta,
    snippets,
    activeEditorDoclinRelativePath
  );

  const thread: Thread = response?.data?.thread;

  await compareSnippetsWithActiveEditor(thread.snippets);
  fillUpThreadOrReplyMessageWithSnippet(thread);

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

  const response = await threadApi.deleteThread(organizationId, projectId, threadId);
  const thread = response?.data?.thread;

  if (activeEditorUri) {
    const fileThreadCacheManager = new FileThreadCacheManager();
    await fileThreadCacheManager.clear(activeEditorUri.fsPath);
  }

  const allThreadsCacheManager = new AllThreadsCacheManager();
  await allThreadsCacheManager.clear(projectId);

  return thread;
};
