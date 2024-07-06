import * as vscode from 'vscode';
import { handleWebviewMessageReceive } from './webviewMessageHandler';
import { getHtmlForWebview } from './providerHelpers/webviewHtml';
import { handleActiveTextEditorChange } from './providerHelpers/activeEditorChange';

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

    webviewView.webview.html = getHtmlForWebview(webviewView.webview, this._extensionUri);

    handleWebviewMessageReceive(webviewView.webview);
    handleActiveTextEditorChange(webviewView);
  }

  public getWebviewView(): vscode.WebviewView | undefined {
    return this._view;
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }
}
