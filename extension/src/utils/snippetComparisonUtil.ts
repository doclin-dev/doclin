import * as vscode from "vscode";
import { Snippet } from "../types";
import logger from "./logger";
import { getExistingDoclinFile } from "./doclinFileReadWriteUtil";
import * as path from 'path';
import { isLocalWorkspace } from "./fileSystemUtil";
import { decodeHtmlEntities } from "./snippetFormatUtil";

export const compareSnippetsWithActiveEditor = async (snippets: Snippet[]): Promise<void> => {
	if (!isLocalWorkspace()) {
		return;
	}

	for(const snippet of snippets) {
		const document = await readFileContent(snippet.filePath);
		if (!document) {
			snippet.outdated = true;
			continue;
		}

		let content = document.getText();

		content = removeLineBreaks(decodeHtmlEntities(content));
		const snippetText = removeLineBreaks(decodeHtmlEntities(snippet.text));
		const startIndex = content.indexOf(snippetText);

		if (startIndex === -1) {
			snippet.outdated = true;
		} else {
			snippet.outdated = false;

			const endIndex = startIndex + snippetText.length;
			const startPos = document.positionAt(startIndex);
			const endPos = document.positionAt(endIndex);

			snippet.updatedRange = new vscode.Range(startPos, endPos);
		}
	};
};

const readFileContent = async (filePath: string): Promise<vscode.TextDocument | null> => {
	try {
		const doclinFilePath = await getExistingDoclinFile();

		if (!doclinFilePath) {
			logger.error("Could not find doclin file path");
			return null;
		}

		const doclinFolder = vscode.Uri.file(path.dirname(doclinFilePath.fsPath));

		const fileUri = vscode.Uri.joinPath(doclinFolder, filePath);
		
		return await vscode.workspace.openTextDocument(fileUri);
		
	} catch (error) {
		return null;
	}
};

const removeLineBreaks = (text: string) => {
	return text.replace(/\n/g, ' ');
};