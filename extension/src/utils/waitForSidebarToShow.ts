import * as vscode from 'vscode';
import { SidebarLoadingStatus } from '../enums';

const GET_SIDEBAR_LOADING_STATUS = 'getSidebarLoadingStatus';
const INTERVAL = 500;
const TIMEOUT = 5000;
let sidebarLoadingStatus: SidebarLoadingStatus = SidebarLoadingStatus.UNMOUNTED;

export const waitForSidebarStatus = (webview: vscode.Webview, targetLoadingStatus: SidebarLoadingStatus) => {
  updateSidebarReadyStatus(webview);

  let timeout: NodeJS.Timeout;
  let interval: NodeJS.Timeout;

  const intervalTimer = new Promise<void>((resolve, reject) => {
    interval = startInterval(targetLoadingStatus, webview, resolve);
    timeout = startTimeout(reject);
  });

  intervalTimer.finally(() => {
    clearInterval(interval);
    clearTimeout(timeout);
  });

  return intervalTimer;
};

const startInterval = (targetLoadingStatus: SidebarLoadingStatus, webview: vscode.Webview, resolve: () => void) => {
  return setInterval(() => {
    if (sidebarLoadingStatus >= targetLoadingStatus) {
      resolve();
    } else {
      updateSidebarReadyStatus(webview);
    }
  }, INTERVAL);
};

const startTimeout = (reject: (reason?: any) => void) => {
  return setTimeout(() => {
    reject(new Error('Please open doclin sidebar to add a comment'));
  }, TIMEOUT);
};

const updateSidebarReadyStatus = (webview: vscode.Webview) => {
  webview.postMessage({
    type: GET_SIDEBAR_LOADING_STATUS,
  });
};

export const handleGetSidebarLoadingStatus = (response: SidebarLoadingStatus) => {
  sidebarLoadingStatus = response;
};
