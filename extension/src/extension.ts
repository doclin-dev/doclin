import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";
import { SecretStorageManager } from "./SecretStorageManager";
import { GlobalStateManager } from "./GlobalStateManager";
import { addCodeSnippet } from "./providerHelpers/addCodeSnippet";
import { initializeAnnotation } from "./providerHelpers/annotation/annotationProvider";
import { DOCLIN_ADD_COMMENT, DOCLIN_VIEW_FILE_THREADS, DOCLIN_VIEW_THREAD } from "./commands";
import { viewFileThreadsCommand } from "./providerHelpers/annotation/viewFileThreadsCommand";
import { viewThreadCommand } from "./providerHelpers/annotation/viewThreadCommand";
import { Thread } from "./types";
import { CopilotSidebarProvider } from "./CopilotSidebarProvider";

export const DOCLIN_SIDEBAR = "doclin.sidebar";
export const DOCLIN_COPILOT_SIDEBAR = "doclin.copilotSidebar";

export function activate(context: vscode.ExtensionContext) {
  	SecretStorageManager.secretStorage = context.secrets;
  	GlobalStateManager.globalState = context.globalState;

	initializeSidebarProvider(context);
	initializeCopilotSidebarProvider(context);
	createStatusBarItem();
	initializeAnnotation(context);
}

const initializeSidebarProvider = (context: vscode.ExtensionContext) => {
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(DOCLIN_SIDEBAR, sidebarProvider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(DOCLIN_ADD_COMMENT, () => addCodeSnippet(sidebarProvider.getWebviewView()))
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(DOCLIN_VIEW_FILE_THREADS, () => viewFileThreadsCommand(sidebarProvider.getWebviewView()))
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(DOCLIN_VIEW_THREAD, (thread: Thread) => viewThreadCommand(thread, sidebarProvider.getWebviewView()))
	);
};

const initializeCopilotSidebarProvider = (context: vscode.ExtensionContext) => {
	const copilotSidebar = new CopilotSidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(DOCLIN_COPILOT_SIDEBAR, copilotSidebar)
	);
};

const createStatusBarItem = () => {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.text = "$(comments-view-icon) Add Comment";
	statusBarItem.command = DOCLIN_ADD_COMMENT;
	statusBarItem.show();
};

export function deactivate() {}
