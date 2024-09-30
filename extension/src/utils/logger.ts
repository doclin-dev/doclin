import * as vscode from 'vscode';
import { PRODUCTION } from '../envConstants';
import { apiService } from '../apiService';
import { LogType } from '../../../shared/enums/LogType';

const info = async (message: string, displayToUser: boolean = false): Promise<void> => {
  if (!PRODUCTION) {
    console.info(message);
  }

  if (displayToUser) {
    vscode.window.showInformationMessage('Doclin: ' + message);
  }

  await apiService.logger.postLog(LogType.INFO, message);
};

const warning = async (message: string, displayToUser: boolean = false): Promise<void> => {
  if (!PRODUCTION) {
    console.warn(message);
  }

  if (displayToUser) {
    vscode.window.showWarningMessage('Doclin: ' + message);
  }

  await apiService.logger.postLog(LogType.WARNING, message);
};

const error = async (message: string, displayToUser: boolean = false): Promise<void> => {
  if (!PRODUCTION) {
    console.error(message);
  }

  if (displayToUser) {
    vscode.window.showErrorMessage('Doclin: ' + message);
  }

  await apiService.logger.postLog(LogType.ERROR, message);
};

export default {
  info,
  warning,
  error,
};
