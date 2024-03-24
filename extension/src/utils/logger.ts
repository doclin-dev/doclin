import loggerApi from "../api/loggerApi";
import { LogType } from "../enums";
import * as vscode from "vscode";
import { PRODUCTION } from "../envConstants";

const info = async (message: string): Promise<void> => {
	if (!PRODUCTION) {
		console.log(info);
	}

	vscode.window.showInformationMessage("Doclin: " + message);
	await loggerApi.postLog(LogType.INFO, message);
};

const warning = async (message: string): Promise<void> => {
	if (!PRODUCTION) {
		console.warn(warning);
	}

	vscode.window.showWarningMessage("Doclin: " + message);
	await loggerApi.postLog(LogType.WARNING, message);
};

const error = async (message: string): Promise<void> => {
	if (!PRODUCTION) {
		console.error(error);
	}

	vscode.window.showErrorMessage("Doclin: " + message);
	await loggerApi.postLog(LogType.ERROR, message);
};

export default {
	info,
	warning,
	error
};