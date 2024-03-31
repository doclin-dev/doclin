import * as vscode from 'vscode';
import { getDoclinRelativeFilePath } from '../activeEditorRelativeFilePath';
import { getThreadsByFilePath } from '../threadProviderHelper';
import { Thread } from '../../types';

let hoverProviderDisposable: vscode.Disposable;

export const registerHoverProvider = (context: vscode.ExtensionContext) => {
	if (hoverProviderDisposable) {
		hoverProviderDisposable.dispose();
	}

	hoverProviderDisposable = vscode.languages.registerHoverProvider({ pattern: '**/*' }, { provideHover });
	context.subscriptions.push(hoverProviderDisposable);
};

const provideHover = async (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) => {
	const filePath: string = await getDoclinRelativeFilePath(document.uri);
	const threads: Thread[] = await getThreadsByFilePath(filePath);

	for (const thread of threads) {
		for (const snippet of thread.snippets) {
			if (snippet.outdated) {
				continue;
			}
			
			if (snippet.updatedRange.contains(position)) {
				const markdown = new vscode.MarkdownString();
				markdown.appendMarkdown(`${thread.username} commented on Doclin\n\n`);
				markdown.appendMarkdown(`**${thread?.title}**\n\n`);
				markdown.appendText(`${thread?.message}\n\n`);

				return new vscode.Hover(markdown);
			}
		}
	}

	return null;
};