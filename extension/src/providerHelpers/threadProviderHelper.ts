import * as vscode from 'vscode';
import threadApi from "../api/threadApi";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";
import { compareSnippetsWithActiveEditor } from "../utils/snippetComparisonUtil";
import { PostThread, Thread, UpdateThread } from "../types";
import { getGitBranch } from "../utils/gitProviderUtil";
import { clearThreadsCache, getCachedThreads, storeThreadsCache } from "../utils/threadCachingUtil";
import { getDoclinRelativeFilePath } from "./activeEditorRelativeFilePath";
import { fillUpThreadOrReplyMessageWithSnippet } from "../utils/fillUpThreadOrReplyMessageWithSnippet";

export const getThreadsByActiveFilePath = async (): Promise<{ threads: Thread[], activeFilePath: string }> => {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const threads = await getThreadsByFilePath(editor.document.uri);

		return { 
			threads, 
			activeFilePath: await getDoclinRelativeFilePath(editor.document.uri) 
		};
	}

	return { threads: [], activeFilePath: "" };
};

export const getThreadsByFilePath = async(documentUri: vscode.Uri): Promise<Thread[]> => {
	const cachedThreads = await getCachedThreads(documentUri.fsPath);

	let threads: Thread[] = [];

	if (cachedThreads) {
		threads = cachedThreads;
	} else {
		const organizationId = await getCurrentOrganizationId();
		const projectId = await getCurrentProjectId();
	
		if (organizationId && projectId) {
			const filePath = await getDoclinRelativeFilePath(documentUri);
			threads = (await threadApi.getFileBasedThreads(organizationId, projectId, filePath))?.data?.threads;
			storeThreadsCache(documentUri.fsPath, threads);
		}
	}

	for (const thread of threads) {
		await compareSnippetsWithActiveEditor(thread.snippets);
		fillUpThreadOrReplyMessageWithSnippet(thread);
	};

	return threads;
};

export const getAllThreads = async (): Promise<Thread[]> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) {
		return [];
	}

	const response = await threadApi.getAllThreads(organizationId, projectId);
	const payload = response?.data;
	let threads: Thread[] = payload?.threads;

	for (const thread of threads) {
		await compareSnippetsWithActiveEditor(thread.snippets);
		fillUpThreadOrReplyMessageWithSnippet(thread);
	};

	return threads;
};

export const postThread = async({ title, threadMessage, delta, snippets, mentionedUserIds, anonymous, isFileThreadSelected }: PostThread): Promise<Thread | undefined> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();
	const activeEditorUri = vscode.window.activeTextEditor?.document.uri;
	const activeEditorDoclinRelativePath = activeEditorUri ? await getDoclinRelativeFilePath(activeEditorUri) : null;
	const gitBranch = await getGitBranch();

	if (!organizationId || !projectId) {
		return;
	}

	const response = await threadApi.postThread(
		organizationId, 
		projectId,
		title,
		threadMessage, 
		delta, 
		snippets,
		isFileThreadSelected ? gitBranch : null,
		isFileThreadSelected ? activeEditorDoclinRelativePath : null,
		mentionedUserIds,
		anonymous,
	);
  
	const thread: Thread = response?.data?.thread;

	await compareSnippetsWithActiveEditor(thread.snippets);
	fillUpThreadOrReplyMessageWithSnippet(thread);

	if (activeEditorUri) {
		await clearThreadsCache(activeEditorUri.fsPath);
	}

	return thread;
};

export const updateThread = async({ title, threadMessage, threadId, snippets, delta }: UpdateThread): Promise<Thread | undefined> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();
	const activeEditorUri = vscode.window.activeTextEditor?.document.uri;
	const activeEditorDoclinRelativePath = activeEditorUri ? await getDoclinRelativeFilePath(activeEditorUri) : null;

	if (!organizationId || !projectId) {
		return;
	}

	const response = await threadApi.updateThread(
		organizationId, 
		projectId, 
		threadId,
		title,
		threadMessage,
		delta,
		snippets,
		activeEditorDoclinRelativePath
	);

	const thread: Thread = response?.data?.thread;

	await compareSnippetsWithActiveEditor(thread.snippets);
	fillUpThreadOrReplyMessageWithSnippet(thread);

	if (activeEditorUri) {
		await clearThreadsCache(activeEditorUri.fsPath);
	}

	return thread;
};

export const deleteThread = async({ threadId }: { threadId: number }) => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();
	const activeEditorUri = vscode.window.activeTextEditor?.document.uri;

	if (!organizationId || !projectId) {return;}
  
	const response = await threadApi.deleteThread(organizationId, projectId, threadId);
	const thread = response?.data?.thread;

	if (activeEditorUri) {
		await clearThreadsCache(activeEditorUri.fsPath);
	}

	return thread;
};