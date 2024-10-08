import * as vscode from 'vscode';
import { getThreadsByFilePath } from '../threadProviderHelper';
import { Thread } from '../../types';

const highlightDecorationType = vscode.window.createTextEditorDecorationType({
  backgroundColor: new vscode.ThemeColor('editor.findRangeHighlightBackground'),
});

export const registerHighlightDecoration = async (hiddenCodeLensRanges: vscode.Range[]) => {
  const openEditors: readonly vscode.TextEditor[] = vscode.window.visibleTextEditors;

  for (const editor of openEditors) {
    await provideHighlighting(editor, hiddenCodeLensRanges);
  }
};

const provideHighlighting = async (editor: vscode.TextEditor, hiddenCodeLensRanges: vscode.Range[]) => {
  let decorationRanges: vscode.Range[] = [];
  const threads: Thread[] = await getThreadsByFilePath(editor.document.uri);

  for (const thread of threads) {
    for (const snippet of thread.snippets) {
      if (snippet.outdated) {
        continue;
      }

      if (hiddenCodeLensRanges.some((hiddenRange) => hiddenRange.isEqual(snippet.updatedRange))) {
        continue;
      }

      decorationRanges.push(snippet.updatedRange);
    }
  }

  editor.setDecorations(highlightDecorationType, decorationRanges);
};
