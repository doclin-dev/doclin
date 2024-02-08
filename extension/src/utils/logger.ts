import loggerApi from "../api/loggerApi";
import { LogType } from "../enums";
import * as vscode from "vscode";

const info = async (message: string): Promise<void> => {
	vscode.window.showInformationMessage("Doclin: " + message);
	await loggerApi.postLog(LogType.INFO, message);
};

const warning = async (message: string): Promise<void> => {
	vscode.window.showWarningMessage("Doclin: " + message);
	await loggerApi.postLog(LogType.WARNING, message);
};

const error = async (message: string): Promise<void> => {
	vscode.window.showErrorMessage("Doclin: " + message);
	await loggerApi.postLog(LogType.ERROR, message);
};

export default {
	info,
	warning,
	error
};