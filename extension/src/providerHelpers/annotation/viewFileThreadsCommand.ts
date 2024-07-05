import * as vscode from 'vscode';
import logger from '../../utils/logger';
import { waitForSidebarStatus } from '../../utils/waitForSidebarToShow';
import { SidebarLoadingStatus } from '../../enums';

export const viewFileThreadsCommand = async (webviewView: vscode.WebviewView | undefined) => {
  try {
    await vscode.commands.executeCommand('workbench.view.extension.doclinSidebarView');

    if (webviewView) {
      const webview = webviewView.webview;

      await waitForSidebarStatus(webview, SidebarLoadingStatus.LOADING);

      webview.postMessage({
        type: 'viewFileThreads',
      });
    }
  } catch (error) {
    logger.error(`Errow while viewing file threads. ${error}`, true);
  }
};
