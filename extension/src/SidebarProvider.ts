import * as vscode from "vscode";
import { authenticate, getExtensionState } from "./providerHelpers/authenticationProviderHelper";
import { apiBaseUrl } from "./constants";
import { getNonce } from "./providerHelpers/getNonce";
import { GlobalStateManager } from "./GlobalStateManager";
import { postThread, deleteThread, getThreadsByActiveFilePath, updateThread } from "./providerHelpers/threadProviderHelper";
import { getGithubUrl, storeProjectId } from "./providerHelpers/projectProviderHelper";
import { getExistingProjects, postProject } from "./providerHelpers/projectProviderHelper";
import { deleteReply, getRepliesByThreadId, postReply, updateReply } from "./providerHelpers/replyProviderHelper";
import { postOrganization, getExistingOrganizations, storeOrganizationId } from "./providerHelpers/organizationProviderHelper";

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

    console.log(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));

    webviewView.webview.onDidReceiveMessage(async (message: { type: any, value: any }) => {
      switch (message.type) {
        case "logout":
          GlobalStateManager.setState(GlobalStateManager.type.AUTH_TOKEN, "");
          break;
        case "authenticate":
          authenticate(async () => {
            webviewView.webview.postMessage({
              type: "getExtensionState",
              value: await getExtensionState(),
            });
          });
          break;
        case "getExtensionState":
          webviewView.webview.postMessage({
            type: "getExtensionState",
            value: await getExtensionState(),
          });
          break;
        case "onInfo":
          if (!message.value) {
            return;
          }
          vscode.window.showInformationMessage(message.value);
          break;
        case "onError":
          if (!message.value) {
            return;
          }
          vscode.window.showErrorMessage(message.value);
          break;
        case "getGithubUrl":
          webviewView.webview.postMessage({
            type: "getGithubUrl",
            value: await getGithubUrl(),
          });
          break;
        case "getThreadsByActiveFilePath":
          webviewView.webview.postMessage({
            type: "getThreadsByActiveFilePath",
            value: await getThreadsByActiveFilePath()
          });
          break;
        case "selectAThread":
          break;
        case "postThread":
          webviewView.webview.postMessage({
            type: "postThread",
            value: await postThread(message.value)
          });
          break;
        case "updateThread":
          webviewView.webview.postMessage({
            type: "updateThread",
            value: await updateThread(message.value)
          });
          break;
        case "deleteThread":
          webviewView.webview.postMessage({
            type: "deleteThread",
            value: await deleteThread(message.value)
          });
          break;
        case "getExistingProjects":
          webviewView.webview.postMessage({
            type: "getExistingProjects",
            value: await getExistingProjects()
          });
          break;
        case "postProject":
          webviewView.webview.postMessage({
            type: "postProject",
            value: await postProject(message.value)
          });
          break;
        case "setCurrentProject":
          webviewView.webview.postMessage({
            type: "setCurrentProject",
            value: await storeProjectId(message.value)
          });
          break;
        case "postReply":
          webviewView.webview.postMessage({
            type: "postReply",
            value: await postReply(message.value)
          });
          break;
        case "getRepliesByThreadId":
          webviewView.webview.postMessage({
            type: "getRepliesByThreadId",
            value: await getRepliesByThreadId(message.value)
          });
          break;
        case "getRepliesByThreadId":
          webviewView.webview.postMessage({
            type: "getRepliesByThreadId",
            value: await getRepliesByThreadId(message.value)
          });
          break;
        case "updateReply":
          webviewView.webview.postMessage({
            type: "updateReply",
            value: await updateReply(message.value)
          });
          break;
				case "deleteReply":
					webviewView.webview.postMessage({
            type: "deleteReply",
            value: await deleteReply(message.value)
          });
          break;
        case "postOrganization":
          webviewView.webview.postMessage({
            type: "postOrganization",
            value: await postOrganization(message.value)
          });
          break;
        case "getExistingOrganizations":
          webviewView.webview.postMessage({
            type: "getExistingOrganizations",
            value: await getExistingOrganizations()
          });
          break;
        case "setCurrentOrganization":
          webviewView.webview.postMessage({
            type: "setCurrentOrganization",
            value: await storeOrganizationId(message.value)
          });
          break;
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
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "styles", "main.css")
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
    );

    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
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
				<link href="${styleUri}" rel="stylesheet">
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
