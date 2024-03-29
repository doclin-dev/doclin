import * as vscode from 'vscode';
import { SidebarLoadingStatus } from '../enums';

const GET_SIDEBAR_LOADING_STATUS = 'getSidebarLoadingStatus';
let sidebarLoadingStatus: SidebarLoadingStatus = SidebarLoadingStatus.UNMOUNTED;

export const waitForSidebarStatus = (webview: vscode.Webview, targetLoadingStatus: SidebarLoadingStatus) => {
	updateSidebarReadyStatus(webview);

	return new Promise<void>((resolve, reject) => {
		let timeout: NodeJS.Timeout;
		const interval = setInterval(() => {
			if (sidebarLoadingStatus === targetLoadingStatus) {
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
		type: GET_SIDEBAR_LOADING_STATUS
	});
};

export const handleGetSidebarLoadingStatus = (response: SidebarLoadingStatus) => {
	sidebarLoadingStatus = response;
};