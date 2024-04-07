import * as vscode from 'vscode';
import { getThreadsByFilePath } from '../threadProviderHelper';
import { Snippet, Thread } from '../../types';
import { DOCLIN_VIEW_FILE_THREADS, DOCLIN_VIEW_THREAD } from '../../commands';
import { registerHighlightDecoration } from './highlightDecoration';

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

	const codeLenses: vscode.CodeLens[] = [createTopCodeLens(threads.length)];
	
	for (const thread of threads) {
		for (const snippet of thread.snippets) {
			if (snippet.outdated) {
				continue;
			}

			console.log(hiddenCodeLensRanges, snippet);
			if ((hiddenCodeLensRanges.some(range => range.isEqual(snippet.updatedRange)))) {
				continue;
			}
			
			codeLenses.push(createSnippetCodeLens(thread, snippet), createHideCodeLens(snippet));
		}
	}

	registerHighlightDecoration(hiddenCodeLensRanges);
	
	return codeLenses;
};

const createTopCodeLens = (threadLength: number) => {
	return new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), {
		title: getTopLensTitle(threadLength),
		command: DOCLIN_VIEW_FILE_THREADS
	});
};

const getTopLensTitle = (threadLength: number) => {
	const comment = threadLength === 1 ? 'comment' : 'comments';
	return `${threadLength} ${comment} on Doclin`;
};

const createSnippetCodeLens = (thread: Thread, snippet: Snippet) => {
	return new vscode.CodeLens(snippet.updatedRange, {
		title: getSnippetLensTitle(thread),
		command: DOCLIN_VIEW_THREAD,
		arguments: [thread]
	});
};

const getSnippetLensTitle = (thread: Thread) => {
	return `${thread.username} commented on Doclin, ${thread.displayCreationTime}`;
};

const createHideCodeLens = (snippet: Snippet) => {
	return new vscode.CodeLens(snippet.updatedRange, {
		title: 'Hide',
		command: 'extension.removeDecoration',
		arguments: [snippet.updatedRange]
	});
};