import * as vscode from 'vscode';
import { getDoclinRelativeFilePath } from '../activeEditorRelativeFilePath';
import { getThreadsByFilePath } from '../threadProviderHelper';
import { Thread } from '../../types';
import { DOCLIN_VIEW_FILE_THREADS, DOCLIN_VIEW_THREAD } from '../../commands';

let codeLensProviderDisposable: vscode.Disposable;
const highlightDecorationType = vscode.window.createTextEditorDecorationType({
	backgroundColor: 'rgba(255, 255, 0, 0.1)',
});

let decorationRanges: vscode.Range[] = [];
let hiddenCodeLensRanges: vscode.Range[] = [];

export const registerCodeLensProvider = (context: vscode.ExtensionContext) => {
	if (codeLensProviderDisposable) {
		codeLensProviderDisposable.dispose();
	}

	codeLensProviderDisposable = vscode.languages.registerCodeLensProvider({ pattern: '**/*' }, { provideCodeLenses });
	context.subscriptions.push(codeLensProviderDisposable);

};

const provideCodeLenses = async (document: vscode.TextDocument) => {
	const filePath: string = await getDoclinRelativeFilePath(document.uri);
	const threads: Thread[] = await getThreadsByFilePath(filePath);

	if (threads.length === 0) {
		return [];
	}

	const topCodeLens = new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), {
		title: getTitle(threads),
		command: DOCLIN_VIEW_FILE_THREADS
	});

	const codeLenses: vscode.CodeLens[] = [topCodeLens];
	decorationRanges = [];
	
	for (const thread of threads) {
		for (const snippet of thread.snippets) {
			if (snippet.outdated) {
				continue;
			}

			if (hiddenCodeLensRanges.some(hiddenRange => hiddenRange.isEqual(snippet.updatedRange))) {
				continue;
			}
			
			const codeLens = new vscode.CodeLens(snippet.updatedRange, {
				title: getThreadTitle(thread),
				command: DOCLIN_VIEW_THREAD,
				arguments: [thread]
			});

			const hideCodeLens = new vscode.CodeLens(snippet.updatedRange, {
				title: 'Hide',
				command: 'extension.removeDecoration',
				arguments: [snippet.updatedRange]
			});

			decorationRanges.push(snippet.updatedRange);

			codeLenses.push(codeLens, hideCodeLens);
		}
	}

	const editor = vscode.window.activeTextEditor;

	if (editor) {
		editor.setDecorations(highlightDecorationType, decorationRanges);
	}

	return codeLenses;
};

const getTitle = (threads: Thread[]) => {
	const comment = threads.length === 1 ? 'comment' : 'comments';

	return `${threads.length} ${comment} on Doclin`;
};

const getThreadTitle = (thread: Thread) => {
	return `${thread.username} left a comment`;
};

export const removeDecoration = (range: vscode.Range) => {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		hiddenCodeLensRanges.push(range);
		decorationRanges = decorationRanges.filter(decorationRange => !decorationRange.isEqual(range));
		editor.setDecorations(highlightDecorationType, decorationRanges);
	}
};