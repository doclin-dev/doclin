import * as vscode from 'vscode';
import { getThreadsByFilePath } from '../threadProviderHelper';
import { Thread } from '../../types';
import { DOCLIN_VIEW_FILE_THREADS, DOCLIN_VIEW_THREAD } from '../../commands';

let codeLensProviderDisposable: vscode.Disposable;

export const registerCodeLensProvider = (context: vscode.ExtensionContext, hiddenCodeLensRanges: vscode.Range[]) => {
	if (codeLensProviderDisposable) {
		codeLensProviderDisposable.dispose();
	}

	codeLensProviderDisposable = vscode.languages.registerCodeLensProvider({ pattern: '**/*' }, { 
		provideCodeLenses: document => provideCodeLenses(document, hiddenCodeLensRanges) 
	});

	context.subscriptions.push(codeLensProviderDisposable);
};

const provideCodeLenses = async (document: vscode.TextDocument, hiddenCodeLensRanges: vscode.Range[]) => {
	const threads: Thread[] = await getThreadsByFilePath(document.uri);

	if (threads.length === 0) {
		return [];
	}

	const topCodeLens = new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), {
		title: getTitle(threads),
		command: DOCLIN_VIEW_FILE_THREADS
	});

	const codeLenses: vscode.CodeLens[] = [topCodeLens];
	
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

			codeLenses.push(codeLens, hideCodeLens);
		}
	}

	return codeLenses;
};

const getTitle = (threads: Thread[]) => {
	const comment = threads.length === 1 ? 'comment' : 'comments';

	return `${threads.length} ${comment} on Doclin`;
};

const getThreadTitle = (thread: Thread) => {
	return `${thread.username} left a comment, ${thread.displayCreationTime}`;
};