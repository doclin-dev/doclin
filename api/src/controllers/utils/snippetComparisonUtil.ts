const FILE_PATH_PREFIX: string = "File Path: ";
const LINE_START_PREFIX: string = "Line Start: ";

export const getFilePathFromCodeBlock = (codeBlockLines: string[], activeEditorFilePath: string) => {
    if (codeBlockLines[0]?.startsWith(FILE_PATH_PREFIX)) {
        return codeBlockLines.shift()?.substring(FILE_PATH_PREFIX.length) || "";
    } else {
        return activeEditorFilePath;
    }
}

export const getLineStartFromCodeBlock = (codeBlockLines: string[]) => {
    if (codeBlockLines[0]?.startsWith(LINE_START_PREFIX)) {
        const lineStartStr = codeBlockLines.shift()?.substring(LINE_START_PREFIX.length) || "1";
        return parseInt(lineStartStr);
    }

    return null;
}

export const getSnippetTag = (snippetId: number) => {
    return `[snippet_${snippetId}]`;
}