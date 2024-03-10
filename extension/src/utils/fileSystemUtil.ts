
import * as vscode from "vscode";
import * as path from 'path';
import * as fs from 'fs';

export const getActiveEditorFolder = (): vscode.Uri | null => {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const filePath = editor.document.uri.fsPath;
		const folderPath = path.dirname(filePath);
		return parseFileToUri(folderPath, editor.document.uri.scheme);
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

export const findFolderInCurrentAndParentFolders = async (folderName: string, startFolder: vscode.Uri): Promise<vscode.Uri | null> => {
	let currentFolder = startFolder.fsPath;
  
	while (currentFolder !== path.dirname(currentFolder)) {
		const folderPath = path.join(currentFolder, folderName);
  
		try {
			await vscode.workspace.fs.readDirectory(parseFileToUri(folderPath, startFolder.scheme));
			return parseFileToUri(folderPath, startFolder.scheme);

		} catch (error) {
			currentFolder = path.dirname(currentFolder);
		}
	}
  
	return null;
};

export const findFileInCurrentAndParentFolders = async (fileName: string, startFolder: vscode.Uri): Promise<vscode.Uri | null> => {
	let currentFolder = startFolder.fsPath;
  
	while (currentFolder !== path.dirname(currentFolder)) {
		const filePath = path.join(currentFolder, fileName);
  
		try {
			await vscode.workspace.fs.readFile(parseFileToUri(filePath, startFolder.scheme));
			return parseFileToUri(filePath, startFolder.scheme);

		} catch (error) {
			currentFolder = path.dirname(currentFolder);
		}
	}
  
	return null;
};

export const parseFileToUri = (filePath: string, scheme: string): vscode.Uri => {
	const newFilePath = replaceBackwardSlashInFilePath(filePath);
	return vscode.Uri.parse(`${scheme}://${newFilePath}`);
};

const replaceBackwardSlashInUri = (uri: vscode.Uri): vscode.Uri => {
	const filePath = replaceBackwardSlashInFilePath(uri.fsPath);
	return vscode.Uri.parse(`${uri.scheme}://${filePath}`);
};

const replaceBackwardSlashInFilePath = (filePath: string): string => {
	return filePath?.replace(/\\/g, '/');
};

export const writeToFilePath = async (filePath: vscode.Uri, content: string) => {
	const utf8Buffer = Buffer.from(content, 'utf-8');
	const utf8Array = new Uint8Array(utf8Buffer);

	await vscode.workspace.fs.writeFile(filePath, utf8Array);
};