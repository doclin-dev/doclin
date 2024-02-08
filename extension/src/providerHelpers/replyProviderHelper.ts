import replyApi from "../api/replyApi";
import { PostReply, Reply, UpdateReply } from "../types";
import { compareSnippetsWithActiveEditor, fillUpThreadOrReplyMessageWithSnippet } from "../utils/snippetComparisonUtil";
import { getCurrentOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId } from "./projectProviderHelper";

export const getRepliesByThreadId = async ({ threadId }: { threadId: number }): Promise<any> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) {return;}

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
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) {return;}

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

	return reply;
};

export const updateReply = async ({ replyMessage, replyId, snippets, delta }: UpdateReply): Promise<any> => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) {return;}

	const response = await replyApi.updateReply(organizationId, projectId, replyId, replyMessage, snippets, delta);
	const reply: Reply = response?.data?.reply;

	await compareSnippetsWithActiveEditor(reply.snippets);
	fillUpThreadOrReplyMessageWithSnippet(reply);

	return reply;
};

export const deleteReply = async ({ replyId }: { replyId: number }) => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !projectId) {return;}

	const response = await replyApi.deleteReply(organizationId, projectId, replyId);
	const reply = response?.data?.reply;

	return reply;
};