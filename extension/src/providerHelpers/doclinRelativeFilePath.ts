import * as vscode from "vscode";
import * as path from 'path';
import { getExistingDoclinFile } from "../utils/doclinFileReadWriteUtil";
import DoclinRelativePathCacheManager from "../utils/cache/DoclinRelativePathCacheManager";

export const getDoclinRelativeFilePath = async (documentUri: vscode.Uri): Promise<string> => {
	const activeEditorFilePath: string = documentUri.fsPath;
	const doclinRelativePathCacheManager = new DoclinRelativePathCacheManager();
	const cachedRelativePath = await doclinRelativePathCacheManager.get(activeEditorFilePath);

	if (cachedRelativePath) {
		return cachedRelativePath;
	}

	const doclinFilePath = await getExistingDoclinFile();

	if (doclinFilePath) {
		const doclinFolder = path.dirname(doclinFilePath.fsPath);
		const doclinRelativePath =  path.relative(doclinFolder, activeEditorFilePath);

		await doclinRelativePathCacheManager.set(activeEditorFilePath, doclinRelativePath);
	
		return doclinRelativePath;
	}

	return "";
};