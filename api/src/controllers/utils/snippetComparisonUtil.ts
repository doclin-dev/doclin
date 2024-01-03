const filePathPrefix: string = "File Path: ";
const lineStartPrefix: string = "Line Start: ";

export const getFilePathFromCodeBlock = (codeBlockLines: string[], activeEditorFilePath: string) => {
    if (codeBlockLines[0]?.startsWith(filePathPrefix)) {
        return codeBlockLines.shift()?.substring(filePathPrefix.length) || "";
    } else {
        return activeEditorFilePath;
    }
}

export const getLineStartFromCodeBlock = (codeBlockLines: string[]) => {
    if (codeBlockLines[0]?.startsWith(lineStartPrefix)) {
        const lineStartStr = codeBlockLines.shift()?.substring(lineStartPrefix.length) || "1";
        return parseInt(lineStartStr);
    } else {
        return 1;
    }
}

export const getSnippetTag = (snippetId: number) => {
    return `[snippet_${snippetId}]`;
}