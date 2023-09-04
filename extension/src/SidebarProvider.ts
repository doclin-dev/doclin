import * as vscode from "vscode";
import { authenticate } from "./providerHelpers/authenticationProviderHelper";
import { apiBaseUrl } from "./constants";
import { getNonce } from "./providerHelpers/getNonce";
import { StateManager } from "./StateManager";
import { getGithubUrl, getActiveEditorFilePath, getThreadsByActiveFilePath } from "./providerHelpers/threadProviderHelper";

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

    webviewView.webview.onDidReceiveMessage(async (data: { type: any, value: any }) => {
      switch (data.type) {
        case "logout": {
          StateManager.setState(StateManager.type.AUTH_TOKEN, "");
          break;
        }
        case "authenticate": {
          authenticate(() => {
            webviewView.webview.postMessage({
              type: "token",
              value: StateManager.getState(StateManager.type.AUTH_TOKEN),
            });
          });
          break;
        }
        case "get-token": {
          webviewView.webview.postMessage({
            type: "token",
            value: StateManager.getState(StateManager.type.AUTH_TOKEN),
          });
          break;
        }
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case "getGithubUrl": {
          webviewView.webview.postMessage({
            type: "getGithubUrl",
            value: await getGithubUrl(),
          });
          break;
        }
        case "getCurrentFilePath": {
          webviewView.webview.postMessage({
            type: "getCurrentFilePath",
            value: await getActiveEditorFilePath()
          });
          break;
        }
        case "getThreadsByActiveFilePath": {
          webviewView.webview.postMessage({
            type: "getThreadsByActiveFilePath",
            value: await getThreadsByActiveFilePath()
          });
          break;
        }
        case "selectAThread": {
          
          break;
        }
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
