import * as vscode from "vscode";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";
import { highlightCode, addLineNumbers } from "../utils/snippetComparisonUtil";
import { SidebarProvider } from "../SidebarProvider";
import { getAuthenticatedUser } from "./authenticationProviderHelper";
import logger from "../utils/logger";
import { getGitBranch } from "../utils/gitProviderUtil";
import { getActiveEditorRelativeFilePath } from "./activeEditorRelativeFilePath";

export const addCodeSnippet = async (sidebarProvider: SidebarProvider) => {
	try {
		vscode.commands.executeCommand('workbench.view.extension.doclinSidebarView');

		const activeTextEditor = vscode.window.activeTextEditor;

		if (!isExtensionReadyForComment()) {
			return;
		}

		if (activeTextEditor) {
			const filePath = await getActiveEditorRelativeFilePath();
			const lineStart = getLineStart(activeTextEditor);
			const originalSnippet = activeTextEditor.document.getText(activeTextEditor.selection);
			const displaySnippet = addLineNumbers(lineStart, highlightCode(originalSnippet));
			const gitBranch = await getGitBranch();

			await pauseExecution(); 

			console.log("checkout output", {
				type: "populateCodeSnippet",
				value: { filePath, lineStart, originalSnippet, displaySnippet, gitBranch },
			});

			sidebarProvider._view?.webview.postMessage({
				type: "populateCodeSnippet",
				value: { filePath, lineStart, originalSnippet, displaySnippet, gitBranch },
			});
		}
	} catch (error) {
		logger.error("Exception occured. " + error);
	}
};

const isExtensionReadyForComment = async (): Promise<boolean> => {
	const activeTextEditor = vscode.window.activeTextEditor;
  
	if (!activeTextEditor) {
		logger.error("No active file detected. Please open a file to add a comment.");
		return false;
	}

	const user = await getAuthenticatedUser();

	if (!user) {
		logger.error("Please log in to your account before adding a comment.");
		return false;
	}

	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) {
		logger.error("Unable to add a comment. Please complete the organization and project setup first.");
		return false;
	}

	return true;
};

const getLineStart = (activeTextEditor: vscode.TextEditor): number => {
	const selection = activeTextEditor.selection;

	if (!selection.isEmpty) {
		return selection.start.line + 1;
	}

	return 1;
};

const pauseExecution = () => {
	return new Promise((resolve) => {
		setTimeout(resolve, 500);
	});
};