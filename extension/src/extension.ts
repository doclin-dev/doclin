import * as vscode from "vscode";
import { authenticate } from "./providerHelpers/authenticationProviderHelper";
import { SidebarProvider } from "./SidebarProvider";
import { SecretStorageManager } from "./SecretStorageManager";
import { addCodeSnippet } from "./providerHelpers/threadProviderHelper";
import { SecretStorageType } from "./enums";

export function activate(context: vscode.ExtensionContext) {
  SecretStorageManager.secretStorage = context.secrets;

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

export function deactivate() {}
