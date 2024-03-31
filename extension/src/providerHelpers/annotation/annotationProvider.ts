import * as vscode from 'vscode';
import { registerHoverProvider } from './hoverProvider';
import { registerCodeLensProvider } from './codeLensProvider';
import { registerHighlightProvider } from './highlightProvider';

let hiddenCodeLensRanges: vscode.Range[] = [];

export const initializeAnnotation = (context: vscode.ExtensionContext) => {
	registerAllAnnotationProviders(context, hiddenCodeLensRanges);
  
	vscode.workspace.onDidChangeTextDocument((event) => {
		if (event.document === vscode.window.activeTextEditor?.document) {
			registerAllAnnotationProviders(context, hiddenCodeLensRanges);
		}
	});

	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			registerHighlightProvider(hiddenCodeLensRanges);
		}
	});

	context.subscriptions.push(vscode.commands.registerCommand('extension.removeDecoration', (range) => {
		removeDecoration(range);
		registerAllAnnotationProviders(context, hiddenCodeLensRanges);
	}));
};

const registerAllAnnotationProviders = (context: vscode.ExtensionContext, hiddenCodeLensRanges: vscode.Range[]) => {
	registerCodeLensProvider(context, hiddenCodeLensRanges);
	registerHoverProvider(context, hiddenCodeLensRanges);
	registerHighlightProvider(hiddenCodeLensRanges);
};

export const removeDecoration = (range: vscode.Range) => {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		hiddenCodeLensRanges.push(range);
	}
};