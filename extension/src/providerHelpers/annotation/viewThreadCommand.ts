import * as vscode from 'vscode';
import logger from '../../utils/logger';
import { waitForSidebarStatus } from '../../utils/waitForSidebarToShow';
import { SidebarLoadingStatus } from '../../enums';
import { Thread } from '../../types';

export const viewThreadCommand = async (thread: Thread, webviewView: vscode.WebviewView | undefined) => {	
	try {
		await vscode.commands.executeCommand('workbench.view.extension.doclinSidebarView');

		if (webviewView) {
			const webview = webviewView.webview;

			await waitForSidebarStatus(webview, SidebarLoadingStatus.LOADING); 

			webview.postMessage({
				type: "viewThread",
				value: thread
			});
		}
	} catch (error) {
		logger.error(`Error while viewing thread. ${error}`, true);
	}
};