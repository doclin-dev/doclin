import * as vscode from "vscode";
import logger from "../utils/logger";
import * as path from 'path';
import { getExistingDoclinFile } from "../utils/doclinFileReadWriteUtil";
import { GlobalStateManager } from "../GlobalStateManager";
import { GlobalStateType } from "../enums";

export const getActiveEditorRelativeFilePath = async (): Promise<string> => {
	try {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const relativePath = await getDoclinRelativeFilePath(editor.document.uri);

			if (isActiveEditorOutsideDoclinFolder(relativePath)) {
				logger.error("Active file path does not belong in this project");
				return "";
			}

			return relativePath;
		}

		return "";

	} catch (error) {
		logger.error("Error while fetching active editor filepath: " + error);
		return "";
	}
};

export const getDoclinRelativeFilePath = async (documentUri: vscode.Uri): Promise<string> => {
	const activeEditorFilePath: string = documentUri.fsPath;
	const relativeFilePathMap = await getRelativeFilePathMapCache();

	if (relativeFilePathMap['activeEditorFilePath']) {
		return relativeFilePathMap['activeEditorFilePath'];
	}

	const doclinFilePath = await getExistingDoclinFile();

	if (doclinFilePath) {
		const doclinFolder = path.dirname(doclinFilePath.fsPath);
		const doclinRelativePath =  path.relative(doclinFolder, activeEditorFilePath);

		relativeFilePathMap[activeEditorFilePath] = doclinRelativePath;
		await updateRelativeFilePathMapCache(relativeFilePathMap);
	
		return doclinRelativePath;

	}

	return "";
};

const getRelativeFilePathMapCache = async (): Promise<Record<string, string>> => {
	let relativeFilePathMap: Record<string, string> = await GlobalStateManager.getState(GlobalStateType.RELATIVE_FILE_PATH_MAP);

	if (!relativeFilePathMap) {
		relativeFilePathMap = {};
	}

	return relativeFilePathMap;
};

const updateRelativeFilePathMapCache = async (map: Record<string, string>): Promise<void> => {
	await GlobalStateManager.setState(GlobalStateType.RELATIVE_FILE_PATH_MAP, map);
};

export const clearRelativeFilePathMapCache = async (): Promise<void> => {
	await GlobalStateManager.setState(GlobalStateType.RELATIVE_FILE_PATH_MAP, {});
};

const isActiveEditorOutsideDoclinFolder = (relativePath: string) => {
	return relativePath.startsWith('..');
};