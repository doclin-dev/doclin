import * as vscode from 'vscode';
import { registerHoverProvider } from './hoverProvider';
import { registerCodeLensProvider, removeDecoration } from './codeLensProvider';



export const initializeAnnotation = (context: vscode.ExtensionContext) => {
	registerCodeLensProvider(context);
	registerHoverProvider(context);
  
	vscode.workspace.onDidChangeTextDocument((event) => {
		if (event.document === vscode.window.activeTextEditor?.document) {
			registerCodeLensProvider(context);
			registerHoverProvider(context);
		}
	});

	context.subscriptions.push(vscode.commands.registerCommand('extension.removeDecoration', (range) => {
		removeDecoration(range);
		registerCodeLensProvider(context);
	}));
};