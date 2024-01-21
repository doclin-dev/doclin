import * as vscode from "vscode";
import * as path from "path";
import threadApi from "../api/threadApi";
import { executeShellCommand } from "./providerHelperUtils";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";
import { getReadableCodeBlock, compareSnippetsWithActiveEditor, fillUpThreadOrReplyMessageWithSnippet, highlightCode, addLineNumbers } from "../utils/snippetComparisonUtil";
import { PostThread, Thread, UpdateThread } from "../types";
import { SidebarProvider } from "../SidebarProvider";

let lastActiveFilePath: string | null = null;

vscode.window.onDidChangeActiveTextEditor((editor) => {
  if (editor && editor.document.uri.scheme === 'file') {
    lastActiveFilePath = editor.document.uri.fsPath;
  }
});

export const getThreadsByActiveFilePath = async (): Promise<{ threads: Thread[], activeFilePath: string }> => {
  const activeFilePath = await getActiveEditorFilePath();
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId || !activeFilePath) {
    return { threads: [], activeFilePath: "" };
  }

  const response = await threadApi.getFileBasedThreads(organizationId, projectId, activeFilePath);
  const payload = response?.data;
  let threads: Thread[] = payload?.threads;

  for (const thread of threads) {
    await compareSnippetsWithActiveEditor(thread.snippets);
  };

  threads.forEach(fillUpThreadOrReplyMessageWithSnippet);

  return { threads, activeFilePath };
};

export const getAllThreads = async (): Promise<Thread[] | undefined> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId) return;

  const response = await threadApi.getAllThreads(organizationId, projectId);
  const payload = response?.data;
  let threads: Thread[] = payload?.threads;

  for (const thread of threads) {
    await compareSnippetsWithActiveEditor(thread.snippets);
  };

  threads.forEach(fillUpThreadOrReplyMessageWithSnippet);

  return threads;
};

export const postThread = async({ threadMessage, delta, snippets, anonymous }: PostThread): Promise<Thread | undefined> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId) return;

  const response = await threadApi.postThread(
    organizationId, 
    projectId, 
    threadMessage, 
    delta, 
    snippets, 
    activeFilePath, 
    anonymous
  );

  const thread: Thread = response?.data?.thread;

  await compareSnippetsWithActiveEditor(thread.snippets);
  fillUpThreadOrReplyMessageWithSnippet(thread);

  return thread;
};

export const updateThread = async({ threadMessage, threadId, snippets, delta }: UpdateThread): Promise<Thread | undefined> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId) return;

  const response = await threadApi.updateThread(
    organizationId, 
    projectId, 
    threadId, 
    threadMessage,
    delta,
    snippets,
    activeFilePath
  );

  const thread: Thread = response?.data?.thread;

  console.log(thread);

  await compareSnippetsWithActiveEditor(thread.snippets);
  fillUpThreadOrReplyMessageWithSnippet(thread);

  console.log(thread);

  return thread;
};

export const deleteThread = async({ threadId }: { threadId: number }) => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId) return;
  
  const response = await threadApi.deleteThread(organizationId, projectId, threadId);
  const thread = response?.data?.thread;

  return thread;
};

const getActiveEditorFilePath = async () : Promise<string> => {
  let activeFilePath: string | null;
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) {
    return "";
  }

  if (activeTextEditor.document.uri.scheme === 'file'){
    activeFilePath = activeTextEditor.document.uri.fsPath;
  } else {
    activeFilePath = lastActiveFilePath;
  }

  if (!activeFilePath){
    return "";
  }

  const activeDirectory: string = path.dirname(activeFilePath);
  const activeFileName = path.basename(activeFilePath);

  let { stdout }: {stdout: string} = await executeShellCommand(`cd ${activeDirectory} && git rev-parse --show-prefix ${activeFileName}`);
  return stdout.split('\n')[0] + activeFileName;
};

export const addCodeSnippet = async (sidebarProvider: SidebarProvider) => {
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) {
    vscode.window.showInformationMessage("No active text editor");
    return;
  }

  vscode.commands.executeCommand('workbench.view.extension.doclin-sidebar-view');

  const filePath = await getActiveEditorFilePath();
  const lineStart = getLineStart(activeTextEditor);
  const originalSnippet = activeTextEditor.document.getText(activeTextEditor.selection);
  const displaySnippet = addLineNumbers(lineStart, highlightCode(originalSnippet));

  // TODO: bug - not the most ideal way to fix this!!
  await pauseExecution(); 

  sidebarProvider._view?.webview.postMessage({
    type: "populateCodeSnippet",
    value: { filePath, lineStart, originalSnippet, displaySnippet },
  });
}

const getLineStart = (activeTextEditor: vscode.TextEditor): number => {
  const selection = activeTextEditor.selection;

  if (!selection.isEmpty) {
    return selection.start.line + 1;
  }

  return 1;
}

const pauseExecution = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}