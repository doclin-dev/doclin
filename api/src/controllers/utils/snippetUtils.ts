export const MULTIPLE_LINE_BREAK_REGEX: RegExp = /(<p><br><\/p>)+/gi;
export const SINGLE_LINE_BREAK: string = '<p><br></p>';

export const getSnippetTag = (snippetId: number) => {
    return `[snippet_${snippetId}]`;
}