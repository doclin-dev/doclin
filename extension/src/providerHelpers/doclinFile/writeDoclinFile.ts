import * as vscode from "vscode";
import { DoclinFile } from "../../types";
import logger from "../../utils/logger";
import * as path from 'path';
import { DOCLIN_FILE_NAME, getExistingDoclinFilePath } from "../../utils/doclinFileReadWriteUtil";
import { findFolderInCurrentAndParentFolders, getActiveEditorFolder, getWorkspaceFolder, isLocal, parseFileToUri, writeToFilePath } from "../../utils/fileSystemUtil";

const GIT_FOLDER_NAME = ".git";

export const writeDoclinFile = async (fileJSON: DoclinFile) => {
	try {
		const workingFolder = getActiveEditorFolder() ?? getWorkspaceFolder();

		if (workingFolder && !isLocal(workingFolder)) {
			logger.error("Initializing doclin is not supported in virtual workspace.");
			return;
		}

		const filePath = await getExistingDoclinFilePath() ?? await computeNewDoclinFilePath();

		if (!filePath) {
			logger.error("Could not compute write file path for doclin file.");
			return;
		}
        
		await writeToFilePath(filePath, JSON.stringify(fileJSON));

	} catch (error) {
		logger.error("Error while creating .doclin file " + error);
	}
};

const computeNewDoclinFilePath = async (): Promise<vscode.Uri | null> => {
	if (vscode.window.activeTextEditor) {
		return await computeNewDoclinFilePathFromActiveEditor();
	}

	return await computeNewDoclinFilePathFromWorkspace();
};

const computeNewDoclinFilePathFromActiveEditor = async (): Promise<vscode.Uri | null> => {
	try {
		const activeEditorFolder = getActiveEditorFolder();

		if (!activeEditorFolder) {
			logger.error(`No folder or file is opened`);
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

const computeNewDoclinFilePathFromWorkspace = async (): Promise<vscode.Uri | null> => {
	try {
		const workspaceFolder = getWorkspaceFolder();

		if (!workspaceFolder) {
			logger.error(`Error during computing new doclin file path`);
			return null;
		}

		const gitRootDirectory = await getGitRootFolder(workspaceFolder);

		if (gitRootDirectory) {
			return vscode.Uri.joinPath(gitRootDirectory, DOCLIN_FILE_NAME);
		}
		
		return vscode.Uri.joinPath(workspaceFolder, DOCLIN_FILE_NAME);
        
	} catch (error) {
		logger.error(`Error computing new doclin file path from workspace ${error}`);
		return null;
	}
};

export const getGitRootFolder = async (folderPath: vscode.Uri) : Promise<vscode.Uri | null> => {
	try {
		const gitFolderPath = await findFolderInCurrentAndParentFolders(GIT_FOLDER_NAME, folderPath);

		if (!gitFolderPath) {
			return null;
		}

		const gitRepoPath = path.dirname(gitFolderPath.fsPath);
		return parseFileToUri(gitRepoPath, gitFolderPath.scheme);

	} catch (error) {
		return null;
	}
};