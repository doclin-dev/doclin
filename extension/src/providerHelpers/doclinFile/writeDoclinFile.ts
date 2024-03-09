import * as vscode from "vscode";
import { DoclinFile } from "../../types";
import logger from "../../utils/logger";
import * as path from 'path';
import * as fs from 'fs';
import { DOCLIN_FILE_NAME, getExistingDoclinFilePath } from "../../utils/doclinFileReadWriteUtil";
import { findFileInCurrentAndParentFolders, getActiveEditorFolder, getWorkspaceFolder, parseFileToUri } from "../../utils/fileSystemUtil";

const GIT_FOLDER_NAME = ".git";

export const writeDoclinFile = async (fileJSON: DoclinFile) => {
	try {
		const filePath = await getExistingDoclinFilePath() ?? await computeNewDoclinFilePath();

		if (!filePath) {
			logger.error("Could not compute write file path for doclin file.");
			return;
		}
        
		await writeDoclinFileToPath(filePath, fileJSON);

	} catch (error) {
		logger.error("Error while creating .doclin file " + error);
	}
};

const computeNewDoclinFilePath = async (): Promise<vscode.Uri | null> => {
	if (vscode.window.activeTextEditor) {
		return await computeNewDoclinFilePathFromActiveEditor();
	}

	return computeNewDoclinFilePathFromWorkspace();
};

const computeNewDoclinFilePathFromActiveEditor = async (): Promise<vscode.Uri | null> => {
	try {
		const activeEditorFolder = getActiveEditorFolder();

		if (!activeEditorFolder) {
			logger.error(`No folder or file is opened`);
			return null;
		}

		const gitRootDirectory = await getGitRootDirectory(activeEditorFolder);

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

		const gitRootDirectory = await getGitRootDirectory(workspaceFolder);

		if (gitRootDirectory) {
			return vscode.Uri.joinPath(gitRootDirectory, DOCLIN_FILE_NAME);
		} else {
			return vscode.Uri.joinPath(workspaceFolder, DOCLIN_FILE_NAME);
		}
        
	} catch (error) {
		logger.error(`Error computing new doclin file path from workspace ${error}`);
		return null;
	}
};

const getGitRootDirectory = async (folderPath: vscode.Uri) : Promise<vscode.Uri | null> => {
	try {
		const gitFolderPath = await findFileInCurrentAndParentFolders(GIT_FOLDER_NAME, folderPath.fsPath);

		if (!gitFolderPath) {
			return null;
		}

		const gitRepoPath = path.dirname(gitFolderPath);
		return parseFileToUri(gitRepoPath);

	} catch (error) {
		return null;
	}
};

const writeDoclinFileToPath = async (filePath: vscode.Uri, fileJSON: DoclinFile) => {
	const utf8Buffer = Buffer.from(JSON.stringify(fileJSON), 'utf-8');
	const utf8Array = new Uint8Array(utf8Buffer);

	await vscode.workspace.fs.writeFile(filePath, utf8Array);
};