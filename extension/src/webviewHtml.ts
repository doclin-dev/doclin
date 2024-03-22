import * as vscode from "vscode";
import { API_BASE_URL } from "./envConstants";
import { getNonce } from "./providerHelpers/getNonce";
import { getExtensionState, isDoclinProjectChanged } from "./utils/sidebarProviderUtil";


export const getHtmlForWebview = (webview: vscode.Webview, extensionUri: vscode.Uri) => {
	const styleUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "media", "styles", "main.css")
	);

	const scriptUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "out", "compiled/sidebar.js")
	);

	const styleMainUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, "out", "compiled/sidebar.css")
	);

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

export const handleActiveTextEditorChange = (webview: vscode.Webview) => {
	vscode.window.onDidChangeActiveTextEditor(async (editor) => {
		if (editor) {
			if (await isDoclinProjectChanged()) {
				webview.postMessage({
					type: "getExtensionState",
					value: await getExtensionState(),
				});
			} else {
				webview.postMessage({
					type: "switchActiveEditor"
				});
			}
		}
	});
};