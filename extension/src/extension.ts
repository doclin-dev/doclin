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

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const decorations = addMarkers();
    addDecorationClickHandler(context, decorations);
  }
}

function addMarkers() {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    const editor = vscode.window.activeTextEditor;
    const { document } = editor;

    const decorationType = vscode.window.createTextEditorDecorationType({
      after: {
        contentText: "🚀",
        margin: "0 0 0 10px",
      }
    });

    const decorations: vscode.DecorationOptions[] = [];
    for (let i = 5; i < 6; i++) {
      const line = document.lineAt(i);
      const range = new vscode.Range(i, line.range.end.character, i, line.range.end.character);
      const decoration = {
        range
      };
      decorations.push(decoration);
    }

    editor.setDecorations(decorationType, decorations);

    return decorations;
  }

  const addDecorationClickHandler = (context: vscode.ExtensionContext, decorations: any) => {
    if (!vscode.window.activeTextEditor) {
      return;
    }

    const editor = vscode.window.activeTextEditor;

    // Handle icon click
    const disposable = vscode.window.onDidChangeTextEditorSelection((event) => {
      if (event.textEditor !== editor) {
        return;
      }

      const clickedPosition = event.selections[0].active;
      decorations.forEach((decoration: any) => {
        if (decoration.range.contains(clickedPosition)) {
          vscode.window.showInformationMessage(`Clicked icon on line ${clickedPosition.line + 1}`);
          // You can perform any action here based on the clicked line
        }
      });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
