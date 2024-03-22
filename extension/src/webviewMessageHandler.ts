import * as vscode from "vscode";
import { executeRemainingMessageFunctions, WEBVIEW_MESSAGE_FUNCTIONS } from "./webviewMessageFunctions";

export const handleMessageReceiveFromWebview = (webview: vscode.Webview) => {
	webview.onDidReceiveMessage(async (message: { type: any, value: any }) => {
		if (WEBVIEW_MESSAGE_FUNCTIONS[message.type]) {
			respondUsingWebviewMessageFunction(message, webview);
		} else {
			executeRemainingMessageFunctions(message, webview);
		}
	});
};

const respondUsingWebviewMessageFunction = (message: any, webview: vscode.Webview) => {
	const result = WEBVIEW_MESSAGE_FUNCTIONS[message.type](message.value);

	if (result instanceof Promise) {
		result.then(value => {
			if (value !== undefined) {
				webview.postMessage({
					type: message.type,
					value: value
				});
			}
		});
	} else if (result !== undefined) {
		webview.postMessage({
			type: message.type,
			value: result
		});
	}
};