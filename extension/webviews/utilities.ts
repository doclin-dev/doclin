export async function populateThreadMessageField(editor: any, { filePath, threadMessage }: { filePath: string, threadMessage: string }){
    editor.insertCodeSnippet({filePath, threadMessage});
};