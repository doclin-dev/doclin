import * as vscode from 'vscode';

const IS_SIDEBAR_READY = 'isSidebarReady';
let isSidebarReady: boolean = false;

export const waitForSidebarToShow = (webview: vscode.Webview) => {
	updateSidebarReadyStatus(webview);

	return new Promise<void>((resolve, reject) => {
		let timeout: NodeJS.Timeout;
		const interval = setInterval(() => {
			if (isSidebarReady) {
				clearInterval(interval);
				clearTimeout(timeout);
				resolve();
			} else {
				updateSidebarReadyStatus(webview);
			}
		}, 500);

		timeout = setTimeout(() => {
			clearInterval(interval);
			reject(new Error("Please open doclin sidebar to add a comment"));
		}, 5000);
	});
};

const updateSidebarReadyStatus = (webview: vscode.Webview) => {
	webview.postMessage({
		type: IS_SIDEBAR_READY
	});
};

export const handleIsSidebarReady = (response: boolean) => {
	isSidebarReady = response;
};