import * as vscode from "vscode";
import logger from "../utils/logger";
import * as path from 'path';
import { getExistingDoclinFile } from "../utils/doclinFileReadWriteUtil";

export const getActiveEditorRelativeFilePath = async (): Promise<string> => {
	try {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const activeEditorFilePath: string = editor.document.uri.fsPath;
			const doclinFilePath = await getExistingDoclinFile();

			if (!doclinFilePath) {
				logger.error("Doclin file does not exist");
				return "";
			}

			const doclinFolder = path.dirname(doclinFilePath.fsPath);

			const relativePath = path.relative(doclinFolder, activeEditorFilePath);

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

const isActiveEditorOutsideDoclinFolder = (relativePath: string) => {
	return relativePath.startsWith('..');
};