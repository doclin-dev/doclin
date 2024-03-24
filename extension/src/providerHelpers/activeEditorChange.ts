import { getExtensionState, isDoclinProjectChanged } from "../utils/sidebarProviderUtil";
import * as vscode from 'vscode';

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