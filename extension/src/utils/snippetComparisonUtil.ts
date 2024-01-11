import * as vscode from "vscode";
import hljs from 'highlight.js';

hljs.configure({
    languages: ['javascript', 'python', 'cpp', 'ruby', 'php', 'html']
});

const PRE_TAG_START: string = `<pre class="ql-syntax" spellcheck="false" contenteditable="false">`;
const PRE_TAG_END: string = `</pre>`;
const FILE_PATH_PREFIX: string = "File Path: ";
const LINE_START_PREFIX: string = "Line Start: ";

const fileContentMap = new Map<vscode.Uri, string>();

export const fillUpThreadMessageWithSnippet = (thread: any) => {
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

    return thread;
}

const getOriginalCodeBlock = (filePath: string, lineStart: number, snippetText: string) => {
    return `${PRE_TAG_START}${FILE_PATH_PREFIX}${filePath}\n${LINE_START_PREFIX}${lineStart}\n${snippetText}${PRE_TAG_END}`;
}

const getReadableCodeBlock = (filePath: string, lineStart: number, snippetText: string, outdated: boolean) => {
    const outdatedText = outdated ? `<label class="outdated-label">Outdated</label>` : "";

    const highlight = hljs.highlightAuto(decodeHtmlEntities(snippetText));
    console.log(highlight.language);
    snippetText = highlight.value;
    snippetText = addLineNumbers(lineStart, snippetText);

    return `<label class="thread-file-path">📁 ${filePath} ${outdatedText}</label>\n
    ${PRE_TAG_START}${snippetText}${PRE_TAG_END}`;
}

const addLineNumbers = (lineStart: number, snippetText: string) => {
    const lines = snippetText.split("\n");
    for (let i = 0; i < lines.length; i++) {
    const lineNumber = lineStart + i;
    lines[i] = lineNumber + " " + lines[i];
    }
    return lines.join("\n");
}

const getSnippetTag = (snippetId: number) => {
    return `[snippet_${snippetId}]`;
}

const decodeHtmlEntities = (encodedString: string) => {
    return encodedString.replace(/&lt;/g,'<')
                        .replace(/&gt;/g,'>')
                        .replace(/&amp;/g,'&');
}

export const compareSnippetWithActiveEditor = async (threads: any) => {
    for(const thread of threads) {
        for(const snippet of thread.snippets) {
            const content = await readFileContent(snippet.filePath);

            if (!content) {
                return;
            }

            const codeStartPosition = decodeHtmlEntities(content).indexOf(decodeHtmlEntities(snippet.text));

            if (codeStartPosition == -1) {
                snippet.outdated = true;
            } else {
                snippet.outdated = false;
                // const codeRange = activeDocument.positionAt(codeStartPosition);
                // const lineNumber = codeRange.line + 1;
            }
        };
    };

    fileContentMap.clear();
}

async function readFileContent(workspaceRelativePath: string): Promise<string | undefined> {
    try {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders || workspaceFolders.length === 0) {
            console.error('No workspace opened.');
            return undefined;
        }

        const workspaceRootPath = workspaceFolders[0].uri.fsPath;
        const fileUri = vscode.Uri.file(`${workspaceRootPath}/${workspaceRelativePath}`);

        if (fileContentMap.has(fileUri)) {
            return fileContentMap.get(fileUri);
        }
        
        const fileContentUint8 = await vscode.workspace.fs.readFile(fileUri);
        const fileContent = Buffer.from(fileContentUint8).toString('utf-8');
        fileContentMap.set(fileUri, fileContent);

        return fileContent;
        
    } catch (error) {
        console.error('Error reading file:', error);
        return undefined;
    }
}