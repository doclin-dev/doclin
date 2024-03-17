import * as vscode from "vscode";
import hljs from 'highlight.js';
import { Reply, Snippet, Thread } from "../types";
import logger from "./logger";
import { getExistingDoclinFile } from "./doclinFileReadWriteUtil";
import * as path from 'path';
import { getActiveEditorFolder, getWorkspaceFolder, isLocalWorkspace } from "./fileSystemUtil";

hljs.configure({
	languages: ['javascript', 'python', 'cpp', 'ruby', 'php', 'html']
});

const PRE_TAG_START: string = `<pre class="ql-syntax" spellcheck="false" contenteditable="false">`;
const PRE_TAG_END: string = `</pre>`;
const OUTDATED_LABEL: string = `<label class="outdated-label">Outdated</label>`;

const gitIcon = `<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="15" height="15" viewBox="0 0 24 24">
						<path fill="currentColor" d="M2.6 10.59L8.38 4.8l1.69 1.7c-.24.85.15 1.78.93 2.23v5.54c-.6.34-1 
						.99-1 1.73a2 2 0 0 0 2 2a2 2 0 0 0 2-2c0-.74-.4-1.39-1-1.73V9.41l2.07 2.09c-.07.15-.07.32-.07.5a2 
						2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2c-.18 0-.35 0-.5.07L13.93 7.5a1.98 1.98 0 0 0-1.15-2.34c-.43-.16-.88-.2-1.28-.09L9.8 
						3.38l.79-.78c.78-.79 2.04-.79 2.82 0l7.99 7.99c.79.78.79 2.04 0 2.82l-7.99 7.99c-.78.79-2.04.79-2.82 
						0L2.6 13.41c-.79-.78-.79-2.04 0-2.82Z">
						</path>
					</svg>
				</span>`;

const fileIcon = `<span class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="15" height="15" viewBox="0 0 24 24">
							<path fill="currentColor" d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m9 16v-2H6v2h9m3-4v-2H6v2h12Z">
							</path>
						</svg>
					</span>`;

const fileContentMap = new Map<vscode.Uri, string>();

export const fillUpThreadOrReplyMessageWithSnippet = (threadOrReply: Thread | Reply): void => {
	threadOrReply.displayMessage = threadOrReply.message;

	for (const snippet of threadOrReply.snippets) {
		threadOrReply.displayMessage = threadOrReply.displayMessage.replace(
			getSnippetTag(snippet.id), 
			getReadableCodeBlock(
				snippet.filePath, 
				snippet.lineStart,
				snippet.text, 
				snippet.outdated,
				snippet.gitBranch
			)
		);
	}
};

export const getReadableCodeBlock = (
	filePath: string,
	lineStart: number,
	snippetText: string,
	outdated: boolean,
	gitBranch: string
) => {
	const outdatedText = outdated ? OUTDATED_LABEL : "";

	const highlight = hljs.highlightAuto(decodeHtmlEntities(snippetText));
	snippetText = highlight.value;
	snippetText = addLineNumbers(lineStart, snippetText);

	let output = `<div class="thread-snippet-container">`;

	if (gitBranch && filePath) {
		output += `<div class="thread-file-path">`;
		output += gitBranch ? `<div class="thread-file-path-text">${gitIcon} ${gitBranch}</div>` : ``;
		output += filePath ? `<div class="thread-file-path-text">${fileIcon} ${filePath}</div>` : ``;
		output += `<div>${outdatedText}</div>`;
		output += `</div>\n`;
	}


	output += `${PRE_TAG_START}${snippetText}${PRE_TAG_END}`;

	output += `</div>`;

	return output;
};

export const highlightCode = (snippetText: string): string => {
	const highlight = hljs.highlightAuto(decodeHtmlEntities(snippetText));
	return highlight.value;
};

export const addLineNumbers = (lineStart: number, snippetText: string): string => {
	if (!lineStart) {
		lineStart = 1;
	}

	const lines = snippetText.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const lineNumber = formatNumber(lineStart + i, 2);
		lines[i] = `<span class="line-number">${lineNumber}</span>  ${lines[i]}`;
	}

	return lines.join("\n");
};

function formatNumber(num: number, length: number) {
	return num.toString().padStart(length, ' ');
}

const getSnippetTag = (snippetId: number) => {
	return `[snippet_${snippetId}]`;
};

const decodeHtmlEntities = (encodedString: string) => {
	return encodedString.replace(/&lt;/g,'<')
		.replace(/&gt;/g,'>')
		.replace(/&amp;/g,'&');
};

const removeLineBreaks = (text: string) => {
	return text.replace(/\n/g, ' ');
};

export const compareSnippetsWithActiveEditor = async (snippets: Snippet[]): Promise<void> => {
	if (!isLocalWorkspace()) {
		return;
	}

	for(const snippet of snippets) {
		let content = await readFileContent(snippet.filePath);

		if (!content) {
			snippet.outdated = true;
			continue;
		}

		content = removeLineBreaks(decodeHtmlEntities(content));
		const snippetText = removeLineBreaks(decodeHtmlEntities(snippet.text));
		const codeStartPosition = content.indexOf(snippetText);

		snippet.outdated = codeStartPosition === -1;
	};

	fileContentMap.clear();
};

const readFileContent = async (filePath: string): Promise<string | null> => {
	try {
		const doclinFilePath = await getExistingDoclinFile();

		if (!doclinFilePath) {
			logger.error("Could not find doclin file path");
			return null;
		}

		const doclinFolder = vscode.Uri.file(path.dirname(doclinFilePath.fsPath));

		const fileUri = vscode.Uri.joinPath(doclinFolder, filePath);

		if (fileContentMap.has(fileUri)) {
			return fileContentMap.get(fileUri) ?? null;
		}
        
		const fileExists = await vscode.workspace.fs.stat(fileUri).then(
			() => true,
			() => false
		);

		if (fileExists) {
			const fileContentUint8 = await vscode.workspace.fs.readFile(fileUri);
			const fileContent = Buffer.from(fileContentUint8).toString('utf-8');
    
			return fileContent;
		}

		return null;
        
	} catch (error) {
		return null;
	}
};