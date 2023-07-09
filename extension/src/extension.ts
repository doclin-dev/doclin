// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from "vscode";
import { authenticate } from "./controllers/authenticationController";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";
import { TokenManager } from "./TokenManager";
import { addCodeSnippet } from "./controllers/threadController";

export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;

  const sidebarProvider = new SidebarProvider(context.extensionUri);

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(beaker) Add Doc";
  item.command = "doclin.addTodo";
  item.show();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("doclin-sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doclin.addTodo", () => {
      addCodeSnippet(sidebarProvider);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doclin.helloWorld", () => {
      vscode.window.showInformationMessage(
        "token value is: " + TokenManager.getToken()
      );
      // HelloWorldPanel.createOrShow(context.extensionUri);
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

  context.subscriptions.push(
    vscode.commands.registerCommand("doclin.refresh", async () => {
      // HelloWorldPanel.kill();
      // HelloWorldPanel.createOrShow(context.extensionUri);
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.doclin-sidebar-view"
      );
      // setTimeout(() => {
      //   vscode.commands.executeCommand(
      //     "workbench.action.webview.openDeveloperTools"
      //   );
      // }, 500);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doclin.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "How was your day?",
        "good",
        "bad"
      );

      if (answer === "bad") {
        vscode.window.showInformationMessage("Sorry to hear that");
      } else {
        console.log({ answer });
      }
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
