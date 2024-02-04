import * as vscode from "vscode";
import { authenticate } from "./providerHelpers/authenticationProviderHelper";
import { SidebarProvider } from "./SidebarProvider";
import { SecretStorageManager } from "./SecretStorageManager";
import { addCodeSnippet } from "./providerHelpers/threadProviderHelper";
import { GlobalStateManager } from "./GlobalStateManager";

const DOCLIN_SIDEBAR = "doclin.sidebar";
const DOCLIN_AUTHENTICATE = "doclin.authenticate";
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

  context.subscriptions.push(
    vscode.commands.registerCommand(DOCLIN_AUTHENTICATE, () => authenticate())
  );
}

const createStatusBarItem = () => {
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(comments-view-icon) Add Comment";
  item.command = DOCLIN_ADD_COMMENT;
  item.show();
}

export function deactivate() {}
