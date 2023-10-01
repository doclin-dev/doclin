import * as vscode from "vscode";
import * as path from "path";
import threadApi from "../api/threadApi";
import { executeShellCommand } from "./providerHelperUtils";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";

export const getThreadsByActiveFilePath = async (): Promise<any> => {
  const activeFilePath = await getActiveEditorFilePath();
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId || !activeFilePath) return;

  const response = await threadApi.getThreads(organizationId, projectId, activeFilePath);
  const payload = response?.data;
  const threads = payload?.threads;

  return threads;
}

export const postThread = async({ threadMessage }: { threadMessage: string }): Promise<any> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId || !activeFilePath) return;

  const response = await threadApi.postThread(organizationId, projectId, threadMessage, activeFilePath);
  const thread = response?.data?.thread;

  return thread;
}

export const updateThread = async({threadMessage, threadId}: {threadMessage: string, threadId: number}): Promise<any> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId || !activeFilePath) return;

  const response = await threadApi.updateThread(organizationId, projectId, threadId, threadMessage, activeFilePath);
  const thread = response?.data?.thread;

  return thread;
}

export const deleteThread = async({ threadId }: { threadId: number }) => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId || !activeFilePath) return;
  
  const response = await threadApi.deleteThread(organizationId, projectId, threadId);
  const thread = response?.data?.thread;

  return thread;
}

export const selectAThread = async (threadId: number): Promise<any> => {
  
}

const getActiveEditorFilePath = async () : Promise<string | undefined> => {
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) {
    return;
  }

  const activeFilePath: string = activeTextEditor.document.uri.fsPath;
  const activeDirectory: string = path.dirname(activeFilePath);
  const activeFileName = path.basename(activeFilePath);

  let { stdout }: {stdout: string} = await executeShellCommand(`cd ${activeDirectory} && git rev-parse --show-prefix ${activeFileName}`);
  return stdout.split('\n')[0] + activeFileName;
}

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

  // Provdies the line numbers of selected text in active editor. 
  // const selection = activeTextEditor.selection;
  // console.log(selection);
  // if (!selection.isEmpty) {
  //   const startLine = selection.start.line + 1; // Line numbers are zero-based, so add 1
  //   const endLine = selection.end.line + 1;

  //   console.log(`Selected text lines: ${startLine}-${endLine}`);
  // } else {
  //     console.log('No text selected');
  // }

  const pauseExecution = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 500); // Resolves the promise after 2 seconds
    });
  }

  await pauseExecution(); 
  // TODO: bug - not the most ideal way to fix this!!
  // Need to check when the sidebar is loaded and then add the textSelection to sidebar

  sidebarProvider._view?.webview.postMessage({
    type: "populateThreadMessage",
    value: {filePath, threadMessage},
  });
}