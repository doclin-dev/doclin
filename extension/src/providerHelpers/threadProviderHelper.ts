import threadApi from "../api/threadApi";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";
import { compareSnippetsWithActiveEditor, fillUpThreadOrReplyMessageWithSnippet } from "../utils/snippetComparisonUtil";
import { PostThread, Thread, UpdateThread } from "../types";
import { getGitBranch } from "../utils/gitProviderUtil";
import { clearThreadsCache, getCachedThreads, storeThreadsCache } from "../utils/threadCachingUtil";
import { getActiveEditorRelativeFilePath } from "./activeEditorRelativeFilePath";

export const getThreadsByActiveFilePath = async (): Promise<{ threads: Thread[], activeFilePath: string }> => {
	const activeFilePath = await getActiveEditorRelativeFilePath();
	
	if (!activeFilePath) {
		return { threads: [], activeFilePath: "" };
	}

	const threads = await getThreadsByFilePath(activeFilePath);

	return { threads, activeFilePath };
};

export const getThreadsByFilePath = async(filePath: string): Promise<Thread[]> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) {
		return [];
	}

	const cachedThreads = await getCachedThreads(filePath);

	let threads: Thread[];

	if (cachedThreads) {
		threads = cachedThreads;
	} else {
		threads = (await threadApi.getFileBasedThreads(organizationId, projectId, filePath))?.data?.threads;
		storeThreadsCache(filePath, threads);
	}

	for (const thread of threads) {
		await compareSnippetsWithActiveEditor(thread.snippets);
	};

	threads.forEach(fillUpThreadOrReplyMessageWithSnippet);

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
	};

	threads.forEach(fillUpThreadOrReplyMessageWithSnippet);

	return threads;
};

export const postThread = async({ title, threadMessage, delta, snippets, mentionedUserIds, anonymous, isFileThreadSelected }: PostThread): Promise<Thread | undefined> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();
	const activeFilePath = await getActiveEditorRelativeFilePath();
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
		isFileThreadSelected ? activeFilePath : null,
		mentionedUserIds,
		anonymous,
	);
  
	const thread: Thread = response?.data?.thread;

	await compareSnippetsWithActiveEditor(thread.snippets);
	fillUpThreadOrReplyMessageWithSnippet(thread);

	await clearThreadsCache(activeFilePath);

	return thread;
};

export const updateThread = async({ title, threadMessage, threadId, snippets, delta }: UpdateThread): Promise<Thread | undefined> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();
	const activeFilePath = await getActiveEditorRelativeFilePath();

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
	const activeFilePath = await getActiveEditorRelativeFilePath();

	if (!organizationId || !projectId) {return;}
  
	const response = await threadApi.deleteThread(organizationId, projectId, threadId);
	const thread = response?.data?.thread;

	await clearThreadsCache(activeFilePath);

	return thread;
};