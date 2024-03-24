import * as vscode from "vscode";
import { authenticate } from "./providerHelpers/authenticationProviderHelper";
import { SidebarProvider } from "./SidebarProvider";
import { SecretStorageManager } from "./SecretStorageManager";
import { GlobalStateManager } from "./GlobalStateManager";
import { addCodeSnippet } from "./providerHelpers/addCodeSnippet";

const DOCLIN_SIDEBAR = "doclin.sidebar";
const DOCLIN_ADD_COMMENT = "doclin.addComment";

export function activate(context: vscode.ExtensionContext) {
	createStatusBarItem();

  	SecretStorageManager.secretStorage = context.secrets;
  	GlobalStateManager.globalState = context.globalState;

	const sidebarProvider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(DOCLIN_SIDEBAR, sidebarProvider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(DOCLIN_ADD_COMMENT, () => addCodeSnippet(sidebarProvider))
	);
}

const createStatusBarItem = () => {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.text = "$(comments-view-icon) Add Comment";
	statusBarItem.command = DOCLIN_ADD_COMMENT;
	statusBarItem.show();
};

export function deactivate() {}
