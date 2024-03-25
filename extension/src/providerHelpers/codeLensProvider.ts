import * as vscode from 'vscode';
import { getDoclinRelativeFilePath } from './activeEditorRelativeFilePath';
import { getThreadsByFilePath } from './threadProviderHelper';
import logger from '../utils/logger';
import { waitForSidebarToShow } from '../utils/waitForSidebarToShow';
import { Thread } from '../types';

let codeLensProviderDisposable: vscode.Disposable;
const DOCLIN_VIEW_FILE_THREADS = "doclin.viewFileThreads";

export const viewFileThreads = async (webviewView: vscode.WebviewView | undefined) => {
	try {
		await vscode.commands.executeCommand('workbench.view.extension.doclinSidebarView');

		if (webviewView) {
			const webview = webviewView.webview;

			await waitForSidebarToShow(webview); 

			webview.postMessage({
				type: "viewFileThreads"
			});
		}
	} catch (error) {
		logger.error("Exception occured. " + error);
	}
};

export const initializeCodeLens = (context: vscode.ExtensionContext) => {
	registerCodeLensProvider(context);
  
	vscode.workspace.onDidChangeTextDocument((event) => {
	  if (event.document === vscode.window.activeTextEditor?.document) {
			registerCodeLensProvider(context);
	  }
	});
};

const registerCodeLensProvider = (context: vscode.ExtensionContext) => {
	if (codeLensProviderDisposable) {
	  codeLensProviderDisposable.dispose();
	}
  
	codeLensProviderDisposable = vscode.languages.registerCodeLensProvider({ pattern: '**/*' }, codeLensProvider);
	context.subscriptions.push(codeLensProviderDisposable);
};

const codeLensProvider = {
	provideCodeLenses: async (document: vscode.TextDocument) => {
		const filePath = await getDoclinRelativeFilePath(document.uri);
		const threads = await getThreadsByFilePath(filePath);

		if (threads.length === 0) {
			return [];
		}

		const codeLens = new vscode.CodeLens(new vscode.Range(0, 0, 0, 0), {
			title: getTitle(threads),
			command: DOCLIN_VIEW_FILE_THREADS
		});

		return [codeLens];
	}
};

const getTitle = (threads: Thread[]) => {
	const comment = threads.length === 1 ? 'comment' : 'comments';

	return `${threads.length} ${comment} on Doclin`;
};