import * as vscode from 'vscode';
import { highlightCode, addLineNumbers } from '../utils/snippetFormatUtil';
import { getAuthenticatedUser } from './authenticationProviderHelper';
import logger from '../utils/logger';
import { getGitBranch } from '../utils/gitProviderUtil';
import { getDoclinRelativeFilePath } from './doclinRelativeFilePath';
import { readDoclinFile } from './doclinFile/readDoclinFile';
import { DoclinFile } from '../types';
import { waitForSidebarStatus } from '../utils/waitForSidebarToShow';
import { SidebarLoadingStatus } from '../enums';

export const addCodeSnippet = async (webviewView: vscode.WebviewView | undefined) => {
  try {
    await vscode.commands.executeCommand('workbench.view.extension.doclinSidebarView');

    const activeTextEditor = vscode.window.activeTextEditor;

    if (await isExtensionNotReadyForComment(activeTextEditor)) {
      return;
    }

    if (activeTextEditor) {
      const filePath = await getActiveEditorRelativeFilePath();
      const lineStart = getLineStart(activeTextEditor);
      const originalSnippet = activeTextEditor.document.getText(activeTextEditor.selection);
      const displaySnippet = addLineNumbers(lineStart, highlightCode(originalSnippet));
      const gitBranch = await getGitBranch();

      if (webviewView) {
        const webview = webviewView.webview;

        await waitForSidebarStatus(webview, SidebarLoadingStatus.LOADING_COMPLETE);

        webview.postMessage({
          type: 'populateCodeSnippet',
          value: {
            filePath,
            lineStart,
            originalSnippet,
            displaySnippet,
            gitBranch,
          },
        });
      }
    }
  } catch (error) {
    logger.error(`Error while adding adding comment ${error}`, true);
  }
};

const isExtensionNotReadyForComment = async (activeTextEditor: vscode.TextEditor | undefined): Promise<boolean> => {
  if (!activeTextEditor) {
    logger.error('No active file detected. Please open a file to add a comment.', true);
    return true;
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    logger.error('Please log in to your account before adding a comment.', true);
    return true;
  }

  const doclinFile: DoclinFile = await readDoclinFile();
  const organizationId = doclinFile?.organizationId;
  const projectId = doclinFile?.projectId;

  if (!organizationId || !projectId) {
    logger.error('Unable to add a comment. Please complete the organization and project setup first.', true);
    return true;
  }

  if (!activeTextEditor.document.getText(activeTextEditor.selection)) {
    logger.error('Please highlight a section of code to add a comment.', true);
    return true;
  }

  return false;
};

const getActiveEditorRelativeFilePath = async (): Promise<string> => {
  try {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const relativePath = await getDoclinRelativeFilePath(editor.document.uri);

      if (isActiveEditorOutsideDoclinFolder(relativePath)) {
        logger.error('Active file path does not belong in this project');
        return '';
      }

      return relativePath;
    }

    return '';
  } catch (error) {
    logger.error('Error while fetching active editor filepath: ' + error);
    return '';
  }
};

const isActiveEditorOutsideDoclinFolder = (relativePath: string) => {
  return relativePath.startsWith('..');
};

const getLineStart = (activeTextEditor: vscode.TextEditor): number => {
  const selection = activeTextEditor.selection;

  if (!selection.isEmpty) {
    return selection.start.line + 1;
  }

  return 1;
};
