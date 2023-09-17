export async function populateThreadMessageField(editor: any, { filePath, threadMessage }: { filePath: string, threadMessage: string }){
    const selection = editor.getSelection(true);
    const cursorPosition: number = selection ? selection.index : editor.getLength();
    const textToInsert = `File Path: ${filePath}\n${threadMessage}\n`;

    editor.insertText(cursorPosition, "\n");
    editor.insertText(cursorPosition + 1, textToInsert);
    editor.formatText(cursorPosition + 1, textToInsert.length, "code-block", true);
    editor.insertText(cursorPosition + 1 + textToInsert.length, "\n");
    editor.setSelection(cursorPosition + 1 + textToInsert.length);
};