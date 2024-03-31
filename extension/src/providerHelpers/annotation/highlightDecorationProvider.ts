import * as vscode from 'vscode';
import { getDoclinRelativeFilePath } from '../activeEditorRelativeFilePath';
import { getThreadsByFilePath } from '../threadProviderHelper';
import { Thread } from '../../types';

const highlightDecorationType = vscode.window.createTextEditorDecorationType({
	backgroundColor: 'rgba(255, 255, 0, 0.1)', // This will be the highlight color
});

export const registerHighlightDecorationProvider = async (): Promise<void> => {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		return;
	}

	const filePath: string = await getDoclinRelativeFilePath(editor.document.uri);
	const threads: Thread[] = await getThreadsByFilePath(filePath);

	const decorationRanges: vscode.Range[] = [];

	for (const thread of threads) {
		for (const snippet of thread.snippets) {
			if (snippet.outdated) {
				continue;
			}

			decorationRanges.push(snippet.updatedRange);
		}
	}

	editor.setDecorations(highlightDecorationType, decorationRanges);
};