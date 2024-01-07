import * as vscode from "vscode";
import * as path from "path";
import threadApi from "../api/threadApi";
import { executeShellCommand } from "./providerHelperUtils";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";

const PRE_TAG_START: string = `<pre class="ql-syntax" spellcheck="false" contenteditable="false">`;
const PRE_TAG_END: string = `</pre>`;
const FILE_PATH_PREFIX: string = "File Path: ";
const LINE_START_PREFIX: string = "Line Start: ";

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

  compareSnippetWithActiveEditor(threads);

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

  compareSnippetWithActiveEditor(threads);

  threads = threads.map(fillUpThreadMessageWithSnippet);

  return threads;
};

const fillUpThreadMessageWithSnippet = (thread: any) => {
  thread.originalMessage = thread.message;
  thread.displayMessage = thread.message;

  for (const snippet of thread.snippets) {
      thread.originalMessage = thread.originalMessage.replace(
        getSnippetTag(snippet.id), 
        getOriginalCodeBlock(snippet.filePath, snippet.lineStart, snippet.text)
      );

      thread.displayMessage = thread.displayMessage.replace(
        getSnippetTag(snippet.id), 
        getReadableCodeBlock(snippet.filePath, snippet.lineStart, snippet.text, snippet.outdated)
      );
  }

  return thread;
}

const getOriginalCodeBlock = (filePath: string, lineStart: number, snippetText: string) => {
  return `${PRE_TAG_START}${FILE_PATH_PREFIX}${filePath}\n${LINE_START_PREFIX}${lineStart}\n${snippetText}${PRE_TAG_END}`;
}

const getReadableCodeBlock = (filePath: string, lineStart: number, snippetText: string, outdated: boolean) => {
  const outdatedText = outdated ? `<label class="outdated-label">Outdated</label>` : "";

  snippetText = addLineNumbers(lineStart, snippetText);

  return `<label class="thread-file-path">📁 ${filePath} ${outdatedText}</label>\n
  ${PRE_TAG_START}${snippetText}${PRE_TAG_END}`;
}

const addLineNumbers = (lineStart: number, snippetText: string) => {
  const lines = snippetText.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const lineNumber = lineStart + i;
    lines[i] = lineNumber + " " + lines[i];
  }
  return lines.join("\n");
}

const getSnippetTag = (snippetId: number) => {
  return `[snippet_${snippetId}]`;
}

const compareSnippetWithActiveEditor = (threads: any) => {
  const activeTextEditor = vscode.window.activeTextEditor;

  if (!activeTextEditor) {
    return;
  }

  const activeDocument = activeTextEditor.document;
  const editorContent = activeDocument.getText();

  threads.forEach((thread: any) => {
    thread.snippets.forEach((snippet: any) => {
      const codeStartPosition = editorContent.replace(/\n/g, ' ').indexOf(snippet.text.replace(/\n/g, ' '));
      if (codeStartPosition == -1) {
        snippet.outdated = true;
      } else {
        snippet.outdated = false;
        const codeRange = activeDocument.positionAt(codeStartPosition);
        const lineNumber = codeRange.line + 1;
      }
    });
  });
}

export const postThread = async({ threadMessage, anonymous }: { threadMessage: string, anonymous: boolean }): Promise<any> => {
  const organizationId = await getCurrentOrganizationId();
  const projectId = await getCurrentProjectId();
  const activeFilePath = await getActiveEditorFilePath();

  if (!organizationId || !projectId || !activeFilePath) return;

  const response = await threadApi.postThread(organizationId, projectId, threadMessage, activeFilePath, anonymous);
  let thread = response?.data?.thread;

  compareSnippetWithActiveEditor([thread]);

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