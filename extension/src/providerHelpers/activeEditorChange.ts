import { getExtensionState, isDoclinProjectChanged } from '../utils/extensionState';
import * as vscode from 'vscode';

export const handleActiveTextEditorChange = (webviewView: vscode.WebviewView) => {
  const webview = webviewView.webview;

  vscode.window.onDidChangeActiveTextEditor(async (editor) => {
    if (webviewView.visible && editor) {
      if (await isDoclinProjectChanged()) {
        webview.postMessage({
          type: 'getExtensionState',
          value: await getExtensionState(),
        });
      } else {
        webview.postMessage({
          type: 'switchActiveEditor',
        });
      }
    }
  });
};
