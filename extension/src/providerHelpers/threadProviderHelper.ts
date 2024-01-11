import * as vscode from "vscode";
import * as path from "path";
import threadApi from "../api/threadApi";
import { executeShellCommand } from "./providerHelperUtils";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";
import { compareSnippetWithActiveEditor, fillUpThreadMessageWithSnippet } from "../utils/snippetComparisonUtil";

let lastActiveFilePath: string | null = null;

vscode.window.onDidChangeActiveTextEditor((editor) => {
  if (editor && editor.document.uri.scheme === 'file') {
    lastActiveFilePath = editor.document.uri.fsPath;
  }
});

export const getThreadsByActiveFilePath = async (): Promise<any> => {
  const activeFilePath = await getActiveEditorFilePath();
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId || !activeFilePath) return;

  const response = await threadApi.getFileBasedThreads(organizationId, projectId, activeFilePath);
  const payload = response?.data;
  let threads = payload?.threads;

  await compareSnippetWithActiveEditor(threads);

  threads = threads.map(fillUpThreadMessageWithSnippet);

  return { threads, activeFilePath };
};

export const getAllThreads = async (): Promise<any> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId) return;

  const response = await threadApi.getAllThreads(organizationId, projectId);
  const payload = response?.data;
  let threads = payload?.threads;

  await compareSnippetWithActiveEditor(threads);

  threads = threads.map(fillUpThreadMessageWithSnippet);

  return threads;
};



export const postThread = async({ threadMessage, anonymous }: { threadMessage: string, anonymous: boolean }): Promise<any> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId || !activeFilePath) return;

  const response = await threadApi.postThread(organizationId, projectId, threadMessage, activeFilePath, anonymous);
  let thread = response?.data?.thread;

  await compareSnippetWithActiveEditor([thread]);

  thread = fillUpThreadMessageWithSnippet(thread);

  return thread;
};

export const updateThread = async({threadMessage, threadId}: {threadMessage: string, threadId: number}): Promise<any> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId || !activeFilePath) return;

  const response = await threadApi.updateThread(organizationId, projectId, threadId, threadMessage, activeFilePath);
  const thread = response?.data?.thread;

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

export const addCodeSnippet = async (sidebarProvider: any) => {
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) {
    vscode.window.showInformationMessage("No active text editor");
    return;
  }

  vscode.commands.executeCommand('workbench.view.extension.doclin-sidebar-view');

  const filePath = await getActiveEditorFilePath();

  const threadMessage = activeTextEditor.document.getText(
    activeTextEditor.selection
  );

  let lineStart;
  const selection = activeTextEditor.selection;

  if (!selection.isEmpty) {
    lineStart = selection.start.line + 1;
  }

  const pauseExecution = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 500); // Resolves the promise after 2 seconds
    });
  }

  await pauseExecution(); 
  // TODO: bug - not the most ideal way to fix this!!
  // Need to check when the sidebar is loaded and then add the textSelection to sidebar

  sidebarProvider._view?.webview.postMessage({
    type: "populateCodeSnippet",
    value: { filePath, threadMessage, lineStart },
  });
}