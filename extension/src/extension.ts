import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";
import { SecretStorageManager } from "./SecretStorageManager";
import { GlobalStateManager } from "./GlobalStateManager";
import { addCodeSnippet } from "./providerHelpers/addCodeSnippet";
import { initializeCodeLens, viewFileThreads } from "./providerHelpers/codeLensProvider";

const DOCLIN_SIDEBAR = "doclin.sidebar";
const DOCLIN_ADD_COMMENT = "doclin.addComment";
const DOCLIN_VIEW_FILE_THREADS = "doclin.viewFileThreads";

export function activate(context: vscode.ExtensionContext) {
  	SecretStorageManager.secretStorage = context.secrets;
  	GlobalStateManager.globalState = context.globalState;

	const sidebarProvider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(DOCLIN_SIDEBAR, sidebarProvider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(DOCLIN_ADD_COMMENT, () => addCodeSnippet(sidebarProvider.getWebviewView()))
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(DOCLIN_VIEW_FILE_THREADS, () => viewFileThreads(sidebarProvider.getWebviewView()))
	);

	createStatusBarItem();
	initializeCodeLens(context);
}

const createStatusBarItem = () => {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.text = "$(comments-view-icon) Add Comment";
	statusBarItem.command = DOCLIN_ADD_COMMENT;
	statusBarItem.show();
};

export function deactivate() {}
