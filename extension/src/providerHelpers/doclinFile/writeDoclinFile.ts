import * as vscode from 'vscode';
import { DoclinFile } from '../../types';
import logger from '../../utils/logger';
import * as path from 'path';
import { DOCLIN_FILE_NAME, getExistingDoclinFile } from '../../utils/doclinFileReadWriteUtil';
import {
  findFolderInCurrentAndParentFolders,
  getActiveEditorFolder,
  getWorkspaceFolder,
  isLocalWorkspace,
  parseFileToUri,
  writeToFilePath,
} from '../../utils/fileSystemUtil';

const GIT_FOLDER_NAME = '.git';

export const writeDoclinFile = async (fileJSON: DoclinFile) => {
  try {
    const workingFolder = getActiveEditorFolder() ?? getWorkspaceFolder();

    if (workingFolder && !isLocalWorkspace()) {
      logger.error('Initializing doclin is not supported in virtual workspace.', true);
      return;
    }

    const filePath = (await getExistingDoclinFile()) ?? (await computeNewDoclinFileUri());

    if (!filePath) {
      logger.error('Could not compute write file path for doclin file.', true);
      return;
    }

    await writeToFilePath(filePath, JSON.stringify(fileJSON));
  } catch (error) {
    logger.error(`Error while creating .doclin file ${error}`, true);
  }
};

const computeNewDoclinFileUri = async (): Promise<vscode.Uri | null> => {
  if (vscode.window.activeTextEditor) {
    return await computeNewDoclinFileUriFromActiveEditor();
  }

  return await computeNewDoclinFileUriFromWorkspace();
};

const computeNewDoclinFileUriFromActiveEditor = async (): Promise<vscode.Uri | null> => {
  try {
    const activeEditorFolder = getActiveEditorFolder();

    if (!activeEditorFolder) {
      logger.error(`No folder or file is opened`, true);
      return null;
    }

    const gitRootDirectory = await getGitRootFolder(activeEditorFolder);

    if (gitRootDirectory) {
      return vscode.Uri.joinPath(gitRootDirectory, DOCLIN_FILE_NAME);
    }

    return vscode.Uri.joinPath(activeEditorFolder, DOCLIN_FILE_NAME);
  } catch (error) {
    logger.error(`Error computing new doclin file path from non workspace ${error}`);
    return null;
  }
};

const computeNewDoclinFileUriFromWorkspace = async (): Promise<vscode.Uri | null> => {
  try {
    const workspaceFolder = getWorkspaceFolder();

    if (!workspaceFolder) {
      logger.error(`Error during computing new doclin file path`, true);
      return null;
    }

    const gitRootDirectory = await getGitRootFolder(workspaceFolder);

    if (gitRootDirectory) {
      return vscode.Uri.joinPath(gitRootDirectory, DOCLIN_FILE_NAME);
    }

    return vscode.Uri.joinPath(workspaceFolder, DOCLIN_FILE_NAME);
  } catch (error) {
    logger.error(`Error computing new doclin file path from workspace ${error}`, true);
    return null;
  }
};

export const getGitRootFolder = async (folderPath: vscode.Uri): Promise<vscode.Uri | null> => {
  try {
    const gitFolderPath = await findFolderInCurrentAndParentFolders(GIT_FOLDER_NAME, folderPath);

    if (!gitFolderPath) {
      return null;
    }

    const gitRepoPath = path.dirname(gitFolderPath.fsPath);
    return parseFileToUri(gitRepoPath);
  } catch (error) {
    return null;
  }
};
