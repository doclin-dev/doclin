import * as vscode from "vscode";
import threadApi from "../api/threadApi";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";
import { compareSnippetsWithActiveEditor, fillUpThreadOrReplyMessageWithSnippet, highlightCode, addLineNumbers } from "../utils/snippetComparisonUtil";
import { PostThread, Thread, UpdateThread } from "../types";
import { SidebarProvider } from "../SidebarProvider";
import { getAuthenticatedUser } from "./authenticationProviderHelper";
import logger from "../utils/logger";
import * as path from 'path';
import { getExistingDoclinFilePath } from "../utils/doclinFileReadWriteUtil";
import { getGitBranch } from "../utils/gitProviderUtil";
import { clearThreadsCache, getCachedThreads, storeThreadsCache } from "../utils/threadCachingUtil";

export const getThreadsByActiveFilePath = async (): Promise<{ threads: Thread[], activeFilePath: string }> => {
	const activeFilePath = await getActiveEditorFilePath();
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId || !activeFilePath) {
		return { threads: [], activeFilePath: "" };
	}

	const cachedThreads = await getCachedThreads(activeFilePath);

	let threads: Thread[];

	if (cachedThreads) {
		threads = cachedThreads;
	} else {
		threads = (await threadApi.getFileBasedThreads(organizationId, projectId, activeFilePath))?.data?.threads;
		storeThreadsCache(activeFilePath, threads);
	}

	for (const thread of threads) {
		await compareSnippetsWithActiveEditor(thread.snippets);
	};

	threads.forEach(fillUpThreadOrReplyMessageWithSnippet);

	return { threads, activeFilePath };
};


export const getAllThreads = async (): Promise<Thread[] | undefined> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) {return;}

	const response = await threadApi.getAllThreads(organizationId, projectId);
	const payload = response?.data;
	let threads: Thread[] = payload?.threads;

	for (const thread of threads) {
		await compareSnippetsWithActiveEditor(thread.snippets);
	};

	threads.forEach(fillUpThreadOrReplyMessageWithSnippet);

	return threads;
};

export const postThread = async({ threadMessage, delta, snippets, mentionedUserIds, anonymous }: PostThread): Promise<Thread | undefined> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();
	const activeFilePath = await getActiveEditorFilePath();

	if (!organizationId || !projectId) {return;}

	const response = await threadApi.postThread(
		organizationId, 
		projectId, 
		threadMessage, 
		delta, 
		snippets, 
		activeFilePath, 
		mentionedUserIds,
		anonymous
	);
  
	const thread: Thread = response?.data?.thread;

	await compareSnippetsWithActiveEditor(thread.snippets);
	fillUpThreadOrReplyMessageWithSnippet(thread);

	await clearThreadsCache(activeFilePath);

	return thread;
};

export const updateThread = async({ threadMessage, threadId, snippets, delta }: UpdateThread): Promise<Thread | undefined> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();
	const activeFilePath = await getActiveEditorFilePath();

	if (!organizationId || !projectId) {return;}

	const response = await threadApi.updateThread(
		organizationId, 
		projectId, 
		threadId, 
		threadMessage,
		delta,
		snippets,
		activeFilePath
	);

	const thread: Thread = response?.data?.thread;

	await compareSnippetsWithActiveEditor(thread.snippets);
	fillUpThreadOrReplyMessageWithSnippet(thread);

	await clearThreadsCache(activeFilePath);

	return thread;
};

export const deleteThread = async({ threadId }: { threadId: number }) => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();
	const activeFilePath = await getActiveEditorFilePath();

	if (!organizationId || !projectId) {return;}
  
	const response = await threadApi.deleteThread(organizationId, projectId, threadId);
	const thread = response?.data?.thread;

	await clearThreadsCache(activeFilePath);

	return thread;
};

const getActiveEditorFilePath = async (): Promise<string> => {
	try {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const activeEditorFilePath: string = editor.document.uri.fsPath;
			const doclinFilePath = await getExistingDoclinFilePath();

			if (!doclinFilePath) {
				logger.error("Doclin file does not exist");
				return "";
			}

			const doclinFolder = path.dirname(doclinFilePath.fsPath);

			const relativePath = path.relative(doclinFolder, activeEditorFilePath);

			if (isActiveEditorOutsideDoclinFolder(relativePath)) {
				logger.error("Active file path does not belong in this project");
				return "";
			}

			return relativePath;
		}

		return "";

	} catch (error) {
		logger.error("Error while fetching active editor filepath: " + error);
		return "";
	}
};

const isActiveEditorOutsideDoclinFolder = (relativePath: string) => {
	return relativePath.startsWith('..');
};

export const addCodeSnippet = async (sidebarProvider: SidebarProvider) => {
	try {
		vscode.commands.executeCommand('workbench.view.extension.doclinSidebarView');

		const activeTextEditor = vscode.window.activeTextEditor;

		if (!isExtensionReadyForComment()) {
			return;
		}

		if (activeTextEditor) {
			const filePath = await getActiveEditorFilePath();
			const lineStart = getLineStart(activeTextEditor);
			const originalSnippet = activeTextEditor.document.getText(activeTextEditor.selection);
			const displaySnippet = addLineNumbers(lineStart, highlightCode(originalSnippet));
			const gitBranch = await getGitBranch();

			await pauseExecution(); 

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
		logger.error("No File Selected");
		return false;
	}

	const user = await getAuthenticatedUser();

	if (!user) {
		logger.error("Need to login before adding any comment.");
		return false;
	}

	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) {
		logger.error("Need to complete organization and project setup before adding any comment.");
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