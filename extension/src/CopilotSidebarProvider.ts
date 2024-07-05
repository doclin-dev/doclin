import * as vscode from 'vscode';
import { handleWebviewMessageReceive } from './webviewMessageHandler';
import { getNonce } from './providerHelpers/getNonce';
import { API_BASE_URL } from './envConstants';

export class CopilotSidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = getHtmlForWebview(webviewView.webview, this._extensionUri);

    handleWebviewMessageReceive(webviewView.webview);
  }

  public getWebviewView(): vscode.WebviewView | undefined {
    return this._view;
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }
}

const getHtmlForWebview = (webview: vscode.Webview, extensionUri: vscode.Uri) => {
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'styles', 'main.css'));

  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'out', 'compiled/copilotSidebar.js'));

  const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'out', 'compiled/copilotSidebar.css'));

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
				<link href="${styleUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
				<script nonce="${nonce}">
					const tsvscode = acquireVsCodeApi();
					const apiBaseUrl = ${JSON.stringify(API_BASE_URL)}
				</script>
			</head>

			<body>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>

			</html>`;
};
