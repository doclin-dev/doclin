const FILE_PATH_PREFIX: string = "File Path: ";
const LINE_START_PREFIX: string = "Line Start: ";

export const getFilePathFromCodeBlock = (codeBlockLines: string[]) => {
    if (codeBlockLines[0]?.startsWith(FILE_PATH_PREFIX)) {
        return codeBlockLines.shift()?.substring(FILE_PATH_PREFIX.length) || null;
    }

    return null;
}

export const getLineStartFromCodeBlock = (codeBlockLines: string[]) => {
    if (codeBlockLines[0]?.startsWith(LINE_START_PREFIX)) {
        const lineStartStr = codeBlockLines.shift()?.substring(LINE_START_PREFIX.length) || null;

        if (!lineStartStr) {
            return null;
        }

        return parseInt(lineStartStr);
    }

    return null;
}

export const getSnippetTag = (snippetId: number) => {
    return `[snippet_${snippetId}]`;
}