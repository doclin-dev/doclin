import * as vscode from "vscode";
import hljs from 'highlight.js';
import { Snippet, Thread } from "../types";

hljs.configure({
    languages: ['javascript', 'python', 'cpp', 'ruby', 'php', 'html']
});

const PRE_TAG_START: string = `<pre class="ql-syntax" spellcheck="false" contenteditable="false">`;
const PRE_TAG_END: string = `</pre>`;
const FILE_PATH_PREFIX: string = "File Path: ";
const LINE_START_PREFIX: string = "Line Start: ";
const OUTDATED_LABEL: string = `<label class="outdated-label">Outdated</label>`;

const fileContentMap = new Map<vscode.Uri, string>();

export const fillUpThreadMessageWithSnippet = (thread: Thread): void => {
    thread.originalMessage = thread.message;
    thread.displayMessage = thread.message;

    for (const snippet of thread.snippets) {
        thread.originalMessage = thread.originalMessage.replace(
            getSnippetTag(snippet.id), 
            getOriginalCodeBlock(snippet.filePath, snippet.lineStart, snippet.text)
        );

        thread.displayMessage = thread.displayMessage.replace(
            getSnippetTag(snippet.id), 
            getReadableCodeBlock(snippet.filePath, snippet.lineStart, snippet.text, snippet.outdated)
        );
    }
}

const getOriginalCodeBlock = (filePath: string, lineStart: number, snippetText: string) => {
    let output = `${PRE_TAG_START}`;
    
    if (filePath) {
        output += `${FILE_PATH_PREFIX}${filePath}\n`;
    }

    if (lineStart) {
        output += `${LINE_START_PREFIX}${lineStart}\n`;
    }
    
    output += `${snippetText}${PRE_TAG_END}`;

    return output;
}

export const getReadableCodeBlock = (filePath: string, lineStart: number, snippetText: string, outdated: boolean) => {
    const outdatedText = outdated ? OUTDATED_LABEL : "";

    const highlight = hljs.highlightAuto(decodeHtmlEntities(snippetText));
    snippetText = highlight.value;
    snippetText = addLineNumbers(lineStart, snippetText);

    let output = ``;

    if (filePath) {
        output +=   `<div class="thread-file-path">
                        <div class="thread-file-path-text">📁 ${filePath}</div> 
                        <div>${outdatedText}</div>
                    </div>\n`;
    }

    output += `${PRE_TAG_START}${snippetText}${PRE_TAG_END}`;

    return output;
}

export const highlightCode = (snippetText: string): string => {
    const highlight = hljs.highlightAuto(decodeHtmlEntities(snippetText));
    return highlight.value;
}

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
}

function formatNumber(num: number, length: number) {
    return num.toString().padStart(length, ' ');
  }

const getSnippetTag = (snippetId: number) => {
    return `[snippet_${snippetId}]`;
}

const decodeHtmlEntities = (encodedString: string) => {
    return encodedString.replace(/&lt;/g,'<')
                        .replace(/&gt;/g,'>')
                        .replace(/&amp;/g,'&');
}

const removeLineBreaks = (text: string) => {
    return text.replace(/\n/g, ' ');
}

export const compareSnippetWithActiveEditor = async (thread: Thread): Promise<void> => {
    for(const snippet of thread.snippets) {
        if (isSnippetNotFromFile(snippet)) {
            snippet.outdated = false;
            continue;
        }

        let content = await readFileContent(snippet.filePath);

        if (!content) {
            snippet.outdated = true;
            continue;
        }

        content = removeLineBreaks(decodeHtmlEntities(content));
        const snippetText = removeLineBreaks(decodeHtmlEntities(snippet.text));
        const codeStartPosition = content.indexOf(snippetText);

        snippet.outdated = codeStartPosition == -1;
    };

    fileContentMap.clear();
}

const isSnippetNotFromFile = (snippet: Snippet) => {
    return !snippet.lineStart;
}

const readFileContent = async (workspaceRelativePath: string): Promise<string | null> => {
    try {
        const fileUri = vscode.Uri.file(`${getCurrentWorkspaceRootPath()}/${workspaceRelativePath}`);

        if (fileContentMap.has(fileUri)) {
            return fileContentMap.get(fileUri) ?? null;
        }
        
        const fileContentUint8 = await vscode.workspace.fs.readFile(fileUri);
        const fileContent = Buffer.from(fileContentUint8).toString('utf-8');

        return fileContent;
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
}

const getCurrentWorkspaceRootPath = (): string | null => {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders || workspaceFolders.length === 0) {
        console.error('No workspace opened.');
        return null;
    }

    return workspaceFolders[0].uri.fsPath;
}