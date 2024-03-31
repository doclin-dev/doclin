import * as vscode from 'vscode';
import { registerHoverProvider } from './hoverProvider';
import { registerCodeLensProvider } from './codeLensProvider';
import { registerHighlightDecorationProvider } from './highlightDecorationProvider';

export const initializeAnnotation = (context: vscode.ExtensionContext) => {
	registerCodeLensProvider(context);
	registerHoverProvider(context);
	registerHighlightDecorationProvider();
  
	vscode.workspace.onDidChangeTextDocument((event) => {
		if (event.document === vscode.window.activeTextEditor?.document) {
			registerCodeLensProvider(context);
			registerHoverProvider(context);
		}
	});
};