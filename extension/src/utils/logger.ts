import loggerApi from "../api/loggerApi";
import { LogType } from "../enums";
import * as vscode from "vscode";

const info = async (message: string): Promise<void> => {
    console.log(message);
    vscode.window.showInformationMessage("Doclin: " + message);
    await loggerApi.postLog(LogType.info, message);
}

const warning = async (message: string): Promise<void> => {
    console.warn(message);
    vscode.window.showWarningMessage("Doclin: " + message);
    await loggerApi.postLog(LogType.warning, message);
}

const error = async (message: string): Promise<void> => {
    console.error(message);
    vscode.window.showErrorMessage("Doclin: " + message);
    await loggerApi.postLog(LogType.error, message);
}

export default {
    info,
    warning,
    error
}