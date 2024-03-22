import * as vscode from "vscode";
import { handleMessagePosting } from "./webviewPostMessage";
import { getHtmlForWebview, handleActiveTextEditorChange } from "./webviewHtml";

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

		handleMessagePosting(webviewView.webview);
		handleActiveTextEditorChange(webviewView.webview);
	}

	public revive(panel: vscode.WebviewView) {
  		this._view = panel;
	}

	
}
