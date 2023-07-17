import * as vscode from "vscode";
import { authenticate } from "./controllers/authenticationController";
import { apiBaseUrl } from "./constants";
import { getNonce } from "./getNonce";
import { TokenManager } from "./TokenManager";

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "logout": {
          TokenManager.setToken("");
          break;
        }
        case "authenticate": {
          authenticate(() => {
            webviewView.webview.postMessage({
              type: "token",
              value: TokenManager.getToken(),
            });
          });
          break;
        }
        case "get-token": {
          webviewView.webview.postMessage({
            type: "token",
            value: TokenManager.getToken(),
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

    const tinymceStylesheetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'node_modules', 'tinymce', 'skins', 'content', 'dark', 'content.min.css')
    );

    const tinymceScriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'node_modules', 'tinymce/tinymce.min.js')
    );

    console.log('t',tinymceScriptUri);

    const quillStylesheetUri = webview.asWebviewUri(
      vscode.Uri.parse("https://cdn.quilljs.com/1.3.6/quill.snow.css")
    );
    const quillScriptUri = webview.asWebviewUri(
      vscode.Uri.parse("https://cdn.quilljs.com/1.3.6/quill.js")
    );
    

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
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <link rel="stylesheet" href="${tinymceStylesheetUri}">
        <link href="${quillStylesheetUri}" rel="stylesheet">
        <script nonce="${nonce}">
          const tsvscode = acquireVsCodeApi();
          const apiBaseUrl = ${JSON.stringify(apiBaseUrl)}
        </script>
			</head>
      <body>
        <script nonce="${nonce}" src="${scriptUri}"></script>
        <script nonce="${nonce}" src="${tinymceScriptUri}">
          tinymce.init({
            selector: '#textEditor',
            // ...other TinyMCE options...
            });
        </script>
    </body>
			</html>`;
  }
}
