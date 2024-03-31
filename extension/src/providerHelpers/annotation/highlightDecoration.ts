import * as vscode from 'vscode';
import { getDoclinRelativeFilePath } from '../activeEditorRelativeFilePath';
import { getThreadsByFilePath } from '../threadProviderHelper';
import { Thread } from '../../types';

const highlightDecorationType = vscode.window.createTextEditorDecorationType({
	backgroundColor: new vscode.ThemeColor('editor.hoverHighlightBackground'),
});


export const registerHighlightDecoration = (hiddenCodeLensRanges: vscode.Range[]) => {
	const openEditors: readonly vscode.TextEditor[] = vscode.window.visibleTextEditors;

	openEditors.forEach(editor => provideHighlighting(editor, hiddenCodeLensRanges));
};

const provideHighlighting = async (editor: vscode.TextEditor, hiddenCodeLensRanges: vscode.Range[]) => {
	let decorationRanges: vscode.Range[] = [];

	const filePath: string = await getDoclinRelativeFilePath(editor.document.uri);
	const threads: Thread[] = await getThreadsByFilePath(filePath);

	for (const thread of threads) {
		for (const snippet of thread.snippets) {
			if (snippet.outdated) {
				continue;
			}

			if (hiddenCodeLensRanges.some(hiddenRange => hiddenRange.isEqual(snippet.updatedRange))) {
				continue;
			}

			decorationRanges.push(snippet.updatedRange);
		}
	}

	editor.setDecorations(highlightDecorationType, decorationRanges);
};