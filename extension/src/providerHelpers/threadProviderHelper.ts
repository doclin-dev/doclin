import * as vscode from "vscode";
import threadApi from "../api/threadApi";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";
import { compareSnippetsWithActiveEditor, fillUpThreadOrReplyMessageWithSnippet, highlightCode, addLineNumbers } from "../utils/snippetComparisonUtil";
import { PostThread, Thread, UpdateThread } from "../types";
import { SidebarProvider } from "../SidebarProvider";
import { getAuthenticatedUser } from "./authenticationProviderHelper";

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

export const postThread = async({ threadMessage, delta, snippets, mentionedUserIds, anonymous }: PostThread): Promise<Thread | undefined> => {
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
    mentionedUserIds,
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

  await compareSnippetsWithActiveEditor(thread.snippets);
  fillUpThreadOrReplyMessageWithSnippet(thread);

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

const getActiveEditorFilePath = async (): Promise<string> => {
  try {
    const activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
      let activeUri: vscode.Uri | null = activeEditor.document.uri;

      const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeUri);

      if (workspaceFolder) {
        const relativePath = vscode.workspace.asRelativePath(activeUri);

        return relativePath;
      } else {
        console.error('No workspace folder found.');
        vscode.window.showInformationMessage('No workspace folder found.');
      }
    } else {
      console.error('No active text editor.');
      vscode.window.showErrorMessage('No active text editor.');
    }

    return "";
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage("Exception occured:" + error);
    return "";
  }
};

export const addCodeSnippet = async (sidebarProvider: SidebarProvider) => {
  try {
    vscode.commands.executeCommand('workbench.view.extension.doclinSidebarView');

    const activeTextEditor = vscode.window.activeTextEditor;

    if (!isExtensionReadyForComment()) {
      return;
    }

    if (activeTextEditor) {
      const filePath = await getActiveEditorFilePath();
      const lineStart = getLineStart(activeTextEditor);
      const originalSnippet = activeTextEditor.document.getText(activeTextEditor.selection);
      const displaySnippet = addLineNumbers(lineStart, highlightCode(originalSnippet));

      await pauseExecution(); 

      sidebarProvider._view?.webview.postMessage({
        type: "populateCodeSnippet",
        value: { filePath, lineStart, originalSnippet, displaySnippet },
      });
    }
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage("Doclin: Exception occured." + error);
  }
}

const isExtensionReadyForComment = async (): Promise<boolean> => {
  const activeTextEditor = vscode.window.activeTextEditor;
  
  if (!activeTextEditor) {
    vscode.window.showErrorMessage("Doclin: No File Selected");
    return false;
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    vscode.window.showErrorMessage("Doclin: Need to login before adding any comment.");
    return false;
  }

  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();

  if (!organizationId || !projectId) {
    vscode.window.showErrorMessage("Doclin: Need to complete organization and project setup before adding any comment.");
    return false;
  }

  return true;
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