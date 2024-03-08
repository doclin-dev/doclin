import * as vscode from "vscode";
import { DoclinFile } from "../types";
import logger from "../utils/logger";
import * as path from 'path';
import * as fs from 'fs';
import { getExistingDoclinFilePath } from "../utils/doclinFileReadWriteUtil";

export const readDoclinFile = async (): Promise<DoclinFile> => {
	try {
		const filePath = await getExistingDoclinFilePath();

		if (filePath) {
			return readDoclinFileFromPath(filePath);
		}

		return createDoclinFile();
        
	} catch (error) {
		logger.error("Error while reading .doclin file " + error);
		return createDoclinFile();
	}
};

const readDoclinFileFromPath = async (doclinFilePath: vscode.Uri): Promise<DoclinFile> => {
	const fileContent = await vscode.workspace.fs.readFile(doclinFilePath);
	return JSON.parse(fileContent.toString()) as DoclinFile;
};

const createDoclinFile = (): DoclinFile => {
	return {
		organizationId: null,
		projectId: null
	};
};