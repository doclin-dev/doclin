import * as vscode from "vscode";
import { DoclinFile } from "../../types";
import logger from "../../utils/logger";
import { getExistingDoclinFile } from "../../utils/doclinFileReadWriteUtil";

export const readDoclinFile = async (): Promise<DoclinFile> => {
	try {
		const fileUri = await getExistingDoclinFile();

		if (fileUri) {
			return readDoclinFileFromUri(fileUri);
		}

		return createDoclinFile();
        
	} catch (error) {
		logger.error("Error while reading .doclin file " + error);
		return createDoclinFile();
	}
};

const readDoclinFileFromUri = async (fileUri: vscode.Uri): Promise<DoclinFile> => {
	const fileContent = await vscode.workspace.openTextDocument(fileUri);
	return JSON.parse(fileContent.getText()) as DoclinFile;
};

const createDoclinFile = (): DoclinFile => {
	return {
		organizationId: null,
		projectId: null
	};
};