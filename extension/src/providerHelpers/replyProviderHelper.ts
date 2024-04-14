import * as vscode from "vscode";
import replyApi from "../api/replyApi";
import { PostReply, Reply, UpdateReply } from "../types";
import AllThreadsCacheManager from "../utils/cache/AllThreadsCacheManager";
import FileThreadCacheManager from "../utils/cache/FileThreadsCacheManager";
import { fillUpThreadOrReplyMessageWithSnippet } from "../utils/fillUpThreadOrReplyMessageWithSnippet";
import { compareSnippetsWithActiveEditor } from "../utils/snippetComparisonUtil";
import { readDoclinFile } from "./doclinFile/readDoclinFile";

export const getRepliesByThreadId = async ({ threadId }: { threadId: number }): Promise<any> => {
	const doclinFile = await readDoclinFile();
	const organizationId = doclinFile?.organizationId;
	const projectId = doclinFile?.projectId;

	if (!organizationId || !projectId) {
		return;
	}

	const response = await replyApi.getReplies(organizationId, projectId, threadId);
	const payload = response?.data;
	const replies: Reply[] = payload?.replies;

	for (const reply of replies) {
		await compareSnippetsWithActiveEditor(reply.snippets);
		fillUpThreadOrReplyMessageWithSnippet(reply);
	}

	return replies;
};

export const postReply = async ({ replyMessage, threadId, anonymous, snippets, delta, mentionedUserIds }: PostReply): Promise<any> => {
	const doclinFile = await readDoclinFile();
	const organizationId = doclinFile?.organizationId;
	const projectId = doclinFile?.projectId;

	if (!organizationId || !projectId) {
		return;
	}

	const response = await replyApi.postReply(
		organizationId, 
		projectId, 
		replyMessage, 
		threadId, 
		anonymous,
		snippets,
		delta,
		mentionedUserIds
	);
  
	const reply: Reply = response?.data?.reply;

	await compareSnippetsWithActiveEditor(reply.snippets);
	fillUpThreadOrReplyMessageWithSnippet(reply);

	clearThreadsCache(projectId);

	return reply;
};

const clearThreadsCache = async (projectId: number) => {
	const activeEditorUri = vscode.window.activeTextEditor?.document.uri;

	if (activeEditorUri) {
		const fileThreadCacheManager = new FileThreadCacheManager();
		await fileThreadCacheManager.clear(activeEditorUri.fsPath);
	}

	const allThreadsCacheManager = new AllThreadsCacheManager();
	await allThreadsCacheManager.clear(projectId);
};

export const updateReply = async ({ replyMessage, replyId, snippets, delta }: UpdateReply): Promise<any> => {
	const doclinFile = await readDoclinFile();
	const organizationId = doclinFile?.organizationId;
	const projectId = doclinFile?.projectId;

	if (!organizationId || !projectId) {
		return;
	}

	const response = await replyApi.updateReply(organizationId, projectId, replyId, replyMessage, snippets, delta);
	const reply: Reply = response?.data?.reply;

	await compareSnippetsWithActiveEditor(reply.snippets);
	fillUpThreadOrReplyMessageWithSnippet(reply);

	return reply;
};

export const deleteReply = async ({ replyId }: { replyId: number }) => {
	const doclinFile = await readDoclinFile();
	const organizationId = doclinFile?.organizationId;
	const projectId = doclinFile?.projectId;

	if (!organizationId || !projectId) {
		return;
	}

	const response = await replyApi.deleteReply(organizationId, projectId, replyId);
	const reply = response?.data?.reply;

	return reply;
};