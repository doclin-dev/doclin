import * as vscode from "vscode";
import logger from "./logger";
import * as path from 'path';
import { findFileInCurrentAndParentFolders, getActiveEditorFolder, getWorkspaceFolder, parseFileToUri } from "./fileSystemUtil";

export const DOCLIN_FILE_NAME = ".doclin";

export const getExistingDoclinFilePath = async (): Promise<vscode.Uri | null> => {
	try {
		const workingFolder = getActiveEditorFolder() ?? getWorkspaceFolder();

		if (!workingFolder) {
			return null;
		}

		const doclinFilePath: string | null = await findFileInCurrentAndParentFolders(DOCLIN_FILE_NAME, workingFolder.fsPath);

		if (!doclinFilePath) {
			return null;
		}

		return parseFileToUri(doclinFilePath);

	} catch (error) {
		logger.error(`Error during getting existing doclin file path`);
		return null;
	}
};