import * as vscode from "vscode";
import * as path from "path";
import threadApi from "../api/threadApi";
import { executeShellCommand } from "./providerHelperUtils";

let lastActiveFilePath: string | null = null;

vscode.window.onDidChangeActiveTextEditor((editor) => {
  if (editor && editor.document.uri.scheme === 'file') {
    lastActiveFilePath = editor.document.uri.fsPath;
  }
});

export const getThreadsByActiveFilePath = async ({ currentProjectId }: { currentProjectId: number }): Promise<any> => {
  const activeFilePath: string = await getActiveEditorFilePath();
  const response = await threadApi.getThreads(currentProjectId, activeFilePath);
  const payload = response?.data;
  const threads = payload?.threads;

  return threads;
};

export const postThread = async({ threadMessage, projectId }: {threadMessage: string, projectId: number}): Promise<any> => {
  const response = await threadApi.postThread(threadMessage, projectId, await getActiveEditorFilePath());
  const thread = response?.data?.thread;

  return thread;
};

export const updateThread = async({threadMessage, threadId}: {threadMessage: string, threadId: number}): Promise<any> => {
  const response = await threadApi.updateThread(threadId, threadMessage, await getActiveEditorFilePath());
  const thread = response?.data?.thread;

  return thread;
};

export const deleteThread = async({ threadId }: { threadId: number }) => {
  const response = await threadApi.deleteThread(threadId);
  const thread = response?.data?.thread;

  return thread;
};

const getActiveEditorFilePath = async () : Promise<string> => {
  let activeFilePath: string | null;
  const { activeTextEditor } = vscode.window;

  if (!activeTextEditor) {
    return "No active text editor found!";
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