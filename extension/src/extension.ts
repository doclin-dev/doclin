// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from "vscode";
import { authenticate } from "./providerHelpers/authenticationProviderHelper";
import { SidebarProvider } from "./SidebarProvider";
import { GlobalStateManager } from "./GlobalStateManager";
import { addCodeSnippet } from "./providerHelpers/threadProviderHelper";

export function activate(context: vscode.ExtensionContext) {
  GlobalStateManager.globalState = context.globalState;

  const sidebarProvider = new SidebarProvider(context.extensionUri);

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(beaker) Add Doc";
  item.command = "doclin.addComment";
  item.show();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("doclin-sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doclin.addComment", () => {
      addCodeSnippet(sidebarProvider);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doclin.authenticate", () => {
      try {
        authenticate();
      } catch (err) {
        console.error(err);
      }
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
