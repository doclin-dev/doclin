import loggerApi from '../api/loggerApi';
import { LogType } from '../enums';
import * as vscode from 'vscode';
import { PRODUCTION } from '../envConstants';

const info = async (message: string, displayToUser: boolean = false): Promise<void> => {
  if (!PRODUCTION) {
    console.log(message);
  }

  if (displayToUser) {
    vscode.window.showInformationMessage('Doclin: ' + message);
  }

  await loggerApi.postLog(LogType.INFO, message);
};

const warning = async (message: string, displayToUser: boolean = false): Promise<void> => {
  if (!PRODUCTION) {
    console.warn(message);
  }

  if (displayToUser) {
    vscode.window.showWarningMessage('Doclin: ' + message);
  }

  await loggerApi.postLog(LogType.WARNING, message);
};

const error = async (message: string, displayToUser: boolean = false): Promise<void> => {
  if (!PRODUCTION) {
    console.error(message);
  }

  if (displayToUser) {
    vscode.window.showErrorMessage('Doclin: ' + message);
  }

  await loggerApi.postLog(LogType.ERROR, message);
};

export default {
  info,
  warning,
  error,
};
