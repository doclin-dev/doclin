import * as vscode from 'vscode';
import { getThreadsByFilePath } from '../threadProviderHelper';
import { Thread } from '../../types';

let hoverProviderDisposable: vscode.Disposable;

export const registerHoverProvider = (context: vscode.ExtensionContext, hiddenCodeLensRanges: vscode.Range[]) => {
	if (hoverProviderDisposable) {
		hoverProviderDisposable.dispose();
	}

	hoverProviderDisposable = vscode.languages.registerHoverProvider({ pattern: '**/*' }, { 
		provideHover: (document, position) => provideHover(document, position, hiddenCodeLensRanges)
	});

	context.subscriptions.push(hoverProviderDisposable);
};

const provideHover = async (document: vscode.TextDocument, position: vscode.Position, hiddenCodeLensRanges: vscode.Range[]) => {
	const threads: Thread[] = await getThreadsByFilePath(document.uri);

	for (const thread of threads) {
		for (const snippet of thread.snippets) {
			if (snippet.outdated) {
				continue;
			}

			if (hiddenCodeLensRanges.some(hiddenRange => hiddenRange.isEqual(snippet.updatedRange))) {
				continue;
			}
			
			if (snippet.updatedRange.contains(position)) {
				const markdown = new vscode.MarkdownString();
				markdown.appendMarkdown(`${thread.username} commented on Doclin, ${thread.displayCreationTime}\n\n`);

				if (thread.title) {
					markdown.appendMarkdown(`**${thread.title}**\n\n`);
				}
				
				markdown.appendText(`${thread?.hoverMessage}\n\n`);

				return new vscode.Hover(markdown);
			}
		}
	}

	return null;
};