import * as vscode from "vscode";
import { authenticate, getAuthenticatedUser } from "./providerHelpers/authenticationProviderHelper";
import { apiBaseUrl } from "./constants";
import { getNonce } from "./providerHelpers/getNonce";
import { GlobalStateManager } from "./GlobalStateManager";
import { createThread, deleteThread, getThreadsByActiveFilePath, updateThread } from "./providerHelpers/threadProviderHelper";
import { getGithubUrl } from "./providerHelpers/projectProviderHelper";
import { getExistingProjects, createProject } from "./providerHelpers/projectProviderHelper";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message: { type: any, value: any }) => {
      switch (message.type) {
        case "logout": {
          GlobalStateManager.setState(GlobalStateManager.type.AUTH_TOKEN, "");
          break;
        }
        case "authenticate": {
          authenticate(() => {
            webviewView.webview.postMessage({
              type: "getAuthenticatedUser",
              value: GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN),
            });
          });
          break;
        }
        case "getAuthenticatedUser": {
          webviewView.webview.postMessage({
            type: "getAuthenticatedUser",
            value: await getAuthenticatedUser(),
          });
          break;
        }
        case "onInfo": {
          if (!message.value) {
            return;
          }
          vscode.window.showInformationMessage(message.value);
          break;
        }
        case "onError": {
          if (!message.value) {
            return;
          }
          vscode.window.showErrorMessage(message.value);
          break;
        }
        case "getGithubUrl": {
          webviewView.webview.postMessage({
            type: "getGithubUrl",
            value: await getGithubUrl(),
          });
          break;
        }
        case "getThreadsByActiveFilePath": {
          webviewView.webview.postMessage({
            type: "getThreadsByActiveFilePath",
            value: await getThreadsByActiveFilePath(message.value)
          });
          break;
        }
        case "selectAThread": {
          break;
        }
        case "createThread": {
          webviewView.webview.postMessage({
            type: "createThread",
            value: await createThread(message.value)
          });
          break;
        }
        case "updateThread": {
          updateThread(message.value);
          break;
        }
        case "deleteThread": {
          webviewView.webview.postMessage({
            type: "deleteThread",
            value: await deleteThread(message.value)
          });
          break;
        }
        case "getExistingProjects": {
          webviewView.webview.postMessage({
            type: "getExistingProjects",
            value: await getExistingProjects()
          });
          break;
        }
        case "createProject": {
          webviewView.webview.postMessage({
            type: "createProject",
            value: await createProject(message.value)
          });
          break;
        }
      }
    });

    vscode.window.onDidChangeActiveTextEditor(async (editor) => {
      if (editor) {
        webviewView.webview.postMessage({
          type: "switchActiveEditor"
        });
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
    );

    const quillStylesheetUri = webview.asWebviewUri(
      vscode.Uri.parse("https://cdn.quilljs.com/1.3.6/quill.snow.css")
    );

    const bootstrapStylesheetUri = webview.asWebviewUri(
      vscode.Uri.parse("https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css")
    )

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${bootstrapStylesheetUri}" rel="stylesheet">
        <link href="${quillStylesheetUri}" rel="stylesheet">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
          const tsvscode = acquireVsCodeApi();
          const apiBaseUrl = ${JSON.stringify(apiBaseUrl)}
        </script>
			</head>
      <body>
        <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
			</html>`;
  }
}
