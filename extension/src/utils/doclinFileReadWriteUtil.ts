import * as vscode from "vscode";
import { DoclinFile } from "../types";
import logger from "./logger";
import { executeShellCommand } from "./excecuteShellCommandUtil";
import * as path from 'path';
import * as fs from 'fs';

const DOCLIN_FILE_NAME = ".doclin";
const GIT_FILE_NAME = ".git";

export const readDoclinFile = async (): Promise<DoclinFile> => {
	try {
		const filePath = await getExistingDoclinFilePath();

		if (filePath) {
			const fileContent = await vscode.workspace.fs.readFile(filePath);
			return JSON.parse(fileContent.toString()) as DoclinFile;
		}

		return newDoclinFile();
        
	} catch (error) {
		logger.error("Error while reading .doclin file " + error);
		return newDoclinFile();
	}
};

const newDoclinFile = (): DoclinFile => {
	return {
		organizationId: null,
		projectId: null
	};
};

export const writeDoclinFile = async (fileJSON: DoclinFile) => {
	try {
		const filePath = await getExistingDoclinFilePath() ?? await computeNewDoclinFilePath();

		if (!filePath) {
			logger.error("Could not compute write file path for doclin file.");
			return;
		}
        
		const utf8Buffer = Buffer.from(JSON.stringify(fileJSON), 'utf-8');
		const utf8Array = new Uint8Array(utf8Buffer);

		await vscode.workspace.fs.writeFile(filePath, utf8Array);

	} catch (error) {
		logger.error("Error while creating .doclin file " + error);
	}
};

export const getExistingDoclinFilePath = async (): Promise<vscode.Uri | null> => {
	try {
		const folderPath = getActiveEditorFolder() ?? getWorkspaceFolder();

		if (!folderPath) {
			logger.error("No folder or file is opened");
			return null;
		}

		const doclinFilePath: string | null = await findFileInCurrentAndParentFolders(DOCLIN_FILE_NAME, folderPath.fsPath);

		if (!doclinFilePath) {
			return null;
		}

		return vscode.Uri.parse(doclinFilePath);

	} catch (error) {
		logger.error(`Error during getting existing doclin file path`);
		return null;
	}
};

export const getWorkspaceFolder = (): vscode.Uri | null => {
	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (workspaceFolders && workspaceFolders.length > 0) {
		return workspaceFolders[0].uri;
	}

	return null;
};

export const getActiveEditorFolder = (): vscode.Uri | null => {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const filePath = editor.document.uri.fsPath;
		const folderPath = path.dirname(filePath);
		return vscode.Uri.parse(folderPath);
	}

	return null;
};

const findFileInCurrentAndParentFolders = async (fileName: string, startFolder: string): Promise<string | null> => {
	let currentFolder = startFolder;
  
	while (currentFolder !== path.dirname(currentFolder)) {
		const filePath = path.join(currentFolder, fileName);
  
		try {
			await fs.promises.access(filePath);
			return filePath;

		} catch (error) {
			currentFolder = path.dirname(currentFolder);
		}
	}
  
	return null;
};

const computeNewDoclinFilePath = async (): Promise<vscode.Uri | null> => {
	if (getWorkspaceFolder()) {
		return computeNewDoclinFilePathFromWorkspace();
	}

	return await computeNewDoclinFilePathFromNonWorkspace();
};

const computeNewDoclinFilePathFromNonWorkspace = async (): Promise<vscode.Uri | null> => {
	try {
		const fileDirectory = getActiveEditorFolder();

		if (!fileDirectory) {
			logger.error(`No folder or file is opened`);
			return null;
		}

		const gitRootDirectory = await getGitRootDirectory(fileDirectory);

		if (gitRootDirectory) {
			return vscode.Uri.joinPath(gitRootDirectory, DOCLIN_FILE_NAME);
		}
        
		return vscode.Uri.joinPath(fileDirectory, DOCLIN_FILE_NAME);

	} catch (error) {
		logger.error(`Error computing new doclin file path from non workspace ${error}`);
		return null;
	}
};

const getGitRootDirectory = async (folderPath: vscode.Uri) : Promise<vscode.Uri | null> => {
	try {
		const gitFolderPath = await findFileInCurrentAndParentFolders(GIT_FILE_NAME, folderPath.fsPath);

		if (!gitFolderPath) {
			return null;
		}

		const gitRepoPath = path.dirname(gitFolderPath);
		return vscode.Uri.parse(gitRepoPath);

	} catch (error) {
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

export const isFolderOrFileOpened = (): boolean => {
	const folderPath = getActiveEditorFolder() ?? getWorkspaceFolder();

	if (folderPath) {
		return true;
	}

	return false;
};