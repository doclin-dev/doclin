
import * as vscode from "vscode";
import * as path from 'path';
import * as fs from 'fs';

export const getActiveEditorFolder = (): vscode.Uri | null => {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const filePath = editor.document.uri.fsPath;
		const folderPath = path.dirname(filePath);
		return parseFileToUri(folderPath);
	}

	return null;
};

export const getWorkspaceFolder = (): vscode.Uri | null => {
	const workspaceFolders = vscode.workspace.workspaceFolders;

	if (workspaceFolders && workspaceFolders.length > 0) {
		return replaceBackwardSlashInUri(workspaceFolders[0].uri);
	}

	return null;
};

export const findFileInCurrentAndParentFolders = async (fileName: string, startFolder: string): Promise<string | null> => {
	let currentFolder = startFolder;
  
	while (currentFolder !== path.dirname(currentFolder)) {
		const filePath = path.join(currentFolder, fileName);
  
		try {
			await fs.promises.access(filePath);
			return replaceBackwardSlashInFilePath(filePath);

		} catch (error) {
			currentFolder = path.dirname(currentFolder);
		}
	}
  
	return null;
};

export const parseFileToUri = (filePath: string): vscode.Uri => {
	const newFilePath = replaceBackwardSlashInFilePath(filePath);
	return vscode.Uri.file(newFilePath);
};

const replaceBackwardSlashInUri = (uri: vscode.Uri): vscode.Uri => {
	const filePath = replaceBackwardSlashInFilePath(uri.fsPath);
	return vscode.Uri.file(filePath);
};

const replaceBackwardSlashInFilePath = (filePath: string): string => {
	return filePath?.replace(/\\/g, '/');
};