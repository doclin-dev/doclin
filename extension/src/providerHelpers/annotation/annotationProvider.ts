import * as vscode from 'vscode';
import { registerHoverProvider } from './hoverProvider';
import { registerCodeLensProvider } from './codeLensProvider';

const refreshAnnotationEvent = new vscode.EventEmitter<void>();

export const initializeAnnotation = (context: vscode.ExtensionContext) => {
	registerCodeLensProvider(context, refreshAnnotationEvent);
	registerHoverProvider(context);
  
	vscode.workspace.onDidChangeTextDocument((event) => {
		if (event.document === vscode.window.activeTextEditor?.document) {
			registerCodeLensProvider(context, refreshAnnotationEvent);
			registerHoverProvider(context);
		}
	});

	refreshAnnotationEvent.event(() => {
		registerCodeLensProvider(context, refreshAnnotationEvent);
	});
};