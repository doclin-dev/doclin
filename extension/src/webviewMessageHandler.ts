import * as vscode from 'vscode';
import { executeRemainingHandlers, VOID_PROVIDERS, RESPONSE_PROVIDERS } from './webviewMessageFunctions';
import { WebviewMessage } from './types';

export const handleWebviewMessageReceive = (webview: vscode.Webview) => {
  webview.onDidReceiveMessage(async (message: WebviewMessage) => {
    if (RESPONSE_PROVIDERS[message.type]) {
      respondToMessage(message, webview);
    } else if (VOID_PROVIDERS[message.type]) {
      executeVoidHandler(message);
    } else {
      executeRemainingHandlers(message, webview);
    }
  });
};

const respondToMessage = (message: WebviewMessage, webview: vscode.Webview) => {
  const result = RESPONSE_PROVIDERS[message.type](message.value);

  if (result instanceof Promise) {
    result.then((value) => {
      webview.postMessage({
        type: message.type,
        value: value,
      });
    });
  } else {
    webview.postMessage({
      type: message.type,
      value: result,
    });
  }
};

const executeVoidHandler = (message: WebviewMessage) => {
  VOID_PROVIDERS[message.type](message.value);
};
