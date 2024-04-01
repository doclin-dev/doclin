import * as vscode from 'vscode';
import { registerHoverProvider } from './hoverProvider';
import { registerCodeLensProvider } from './codeLensProvider';
import { registerHighlightDecoration } from './highlightDecoration';

let hiddenCodeLensRanges: vscode.Range[] = [];

export const initializeAnnotation = (context: vscode.ExtensionContext) => {
	registerAllAnnotationProviders(context, hiddenCodeLensRanges);
	setupEventsForHighlight();

	context.subscriptions.push(vscode.commands.registerCommand('extension.removeDecoration', (range) => {
		removeDecoration(range);
		registerAllAnnotationProviders(context, hiddenCodeLensRanges);
	}));
};

const registerAllAnnotationProviders = async (context: vscode.ExtensionContext, hiddenCodeLensRanges: vscode.Range[]) => {
	registerCodeLensProvider(context, hiddenCodeLensRanges);
	registerHoverProvider(context, hiddenCodeLensRanges);
	await registerHighlightDecoration(hiddenCodeLensRanges);
};

const setupEventsForHighlight = () => {
	vscode.workspace.onDidChangeTextDocument((event) => {
		if (event.document === vscode.window.activeTextEditor?.document) {
			registerHighlightDecoration(hiddenCodeLensRanges);
		}
	});

	vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			registerHighlightDecoration(hiddenCodeLensRanges);
		}
	});
};

const removeDecoration = (range: vscode.Range) => {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		hiddenCodeLensRanges.push(range);
	}
};