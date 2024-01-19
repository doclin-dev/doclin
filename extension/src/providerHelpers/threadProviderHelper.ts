import * as vscode from "vscode";
import * as path from "path";
import threadApi from "../api/threadApi";
import { executeShellCommand } from "./providerHelperUtils";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";
import { compareSnippetWithActiveEditor, fillUpThreadMessageWithSnippet } from "../utils/snippetComparisonUtil";
import { Thread } from "../types";
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
  let threads = payload?.threads;

  for (const thread of threads) {
    await compareSnippetWithActiveEditor(thread);
  };

  threads.forEach(fillUpThreadMessageWithSnippet);

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
    await compareSnippetWithActiveEditor(thread);
  };

  threads.forEach(fillUpThreadMessageWithSnippet);

  return threads;
};

export const postThread = async({ threadMessage, anonymous }: { threadMessage: string, anonymous: boolean }): Promise<Thread | undefined> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId) return;

  const response = await threadApi.postThread(organizationId, projectId, threadMessage, activeFilePath, anonymous);
  let thread = response?.data?.thread;

  await compareSnippetWithActiveEditor(thread);
  fillUpThreadMessageWithSnippet(thread);

  return thread;
};

export const updateThread = async({threadMessage, threadId}: {threadMessage: string, threadId: number}): Promise<Thread | undefined> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId || !activeFilePath) return;

  const response = await threadApi.updateThread(organizationId, projectId, threadId, threadMessage, activeFilePath);
  let thread = response?.data?.thread;

  await compareSnippetWithActiveEditor(thread);
  fillUpThreadMessageWithSnippet(thread);

  return thread;
};

export const deleteThread = async({ threadId }: { threadId: number }) => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId || !activeFilePath) return;
  
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
  const threadMessage = activeTextEditor.document.getText(activeTextEditor.selection);
  const lineStart = getLineStart(activeTextEditor);

  // TODO: bug - not the most ideal way to fix this!!
  // Need to check when the sidebar is loaded and then add the textSelection to sidebar
  await pauseExecution(); 

  sidebarProvider._view?.webview.postMessage({
    type: "populateCodeSnippet",
    value: { filePath, threadMessage, lineStart },
  });
}

const getLineStart = (activeTextEditor: vscode.TextEditor) => {
  const selection = activeTextEditor.selection;

  if (!selection.isEmpty) {
    return selection.start.line + 1;
  }

  return null;
}

const pauseExecution = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}