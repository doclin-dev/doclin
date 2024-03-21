import * as vscode from "vscode";
import logger from "./logger";
import { findFileInCurrentAndParentFolders, getActiveEditorFolder, getWorkspaceFolder, isLocalWorkspace } from "./fileSystemUtil";

export const DOCLIN_FILE_NAME = ".doclin";

export const getExistingDoclinFile = async (): Promise<vscode.Uri | null> => {
	try {
		const workingFolder = getActiveEditorFolder() ?? getWorkspaceFolder();

		if (!workingFolder) {
			return null;
		}

		if (isLocalWorkspace()) {
			return await getLocalDoclinFile(workingFolder);
		}

		return await getRemoteDoclinFile();

	} catch (error) {
		logger.error(`Error during getting existing doclin file path`);
		return null;
	}
};

const getLocalDoclinFile = async (workingFolder: vscode.Uri): Promise<vscode.Uri | null> => {
	return await findFileInCurrentAndParentFolders(DOCLIN_FILE_NAME, workingFolder);
};

const getRemoteDoclinFile = async (): Promise<vscode.Uri | null> => {
	const files = await vscode.workspace.findFiles(DOCLIN_FILE_NAME);
	return files.length > 0 ? files[0] : null;
};