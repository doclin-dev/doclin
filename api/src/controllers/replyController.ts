import { ReplySnippet } from "../database/entities/ReplySnippet";
import { Reply } from "../database/entities/Reply";
import { ReplyRepository } from "../database/repositories/ReplyRepository";
import { ThreadRepository } from "../database/repositories/ThreadRepository";
import { MULTIPLE_LINE_BREAK_REGEX, SINGLE_LINE_BREAK, fillUpThreadOrReplyMessageWithSnippet, getSnippetTag } from "./utils/snippetUtils";
import { mapReplyResponse } from "./utils/mapperUtils";
import { sendMentionEmailNotification } from "./emailNotificationController";
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const postReply = async (req: any, res: any) => {
	const threadId = req.params.threadId;
	const replyMessage = DOMPurify.sanitize(req.body.replyMessage);
	const thread = await ThreadRepository.findThreadById(threadId);
	const anonymous = req.body.anonymous;
	const snippets = req.body.snippets;
	const delta = req.body.delta;
	const mentionedUserIds: number[] = req.body.mentionedUserIds;

	if(!thread) {
		res.send({ reply: null });
		return;
	}
    
	let { updatedReplyMessage, snippetEntities } = await createSnippetEntitiesFromReplyMessage(replyMessage, snippets);

	const reply = await Reply.create({
		threadId: threadId,
		message: updatedReplyMessage,
		userId: req.userId,
		anonymous: anonymous,
		delta: delta,
		snippets: snippetEntities
	}).save();

	const projectId = thread.projectId;

	if (mentionedUserIds.length > 0){
		sendMentionEmailNotification(
			req.userId, 
			mentionedUserIds, 
			projectId, 
			fillUpThreadOrReplyMessageWithSnippet(replyMessage, snippets)
		);
	}

	const replyResponse = await ReplyRepository.findReplyWithPropertiesById(reply.id);
	const response = replyResponse ? mapReplyResponse(replyResponse) : null;
 
	res.send({ reply: response });
};

const createSnippetEntitiesFromReplyMessage = async (replyMessage: string, snippetblots: any[]) => {
	let updatedReplyMessage: string = "";

	updatedReplyMessage = replyMessage.replace(MULTIPLE_LINE_BREAK_REGEX, SINGLE_LINE_BREAK);

	const snippetEntities = [];

	for (const snippetblot of snippetblots) {
		const snippet: ReplySnippet = await ReplySnippet.create({
			text: snippetblot.originalSnippet,
			filePath: snippetblot.filePath,
			lineStart: snippetblot.lineStart,
			gitBranch: snippetblot.gitBranch
		}).save();

		snippetEntities.push(snippet);

		updatedReplyMessage = updatedReplyMessage.replace(getSnippetTag(snippetblot.index), getSnippetTag(snippet.id));
	}

	return { updatedReplyMessage, snippetEntities }; 
};

export const getReplies = async (req: any, res: any) => {
	const threadId = req.params.threadId;

	const replies = await ReplyRepository.findRepliesWithPropertiesByThreadId(threadId);
    
	const response = replies.map(mapReplyResponse);

	res.send({ replies: response });
};

export const updateReplyMessage = async (req: any, res: any) => {
	const replyId: number = req.params.id;
	const replyMessage: string = DOMPurify.sanitize(req.body.message);
	const snippets: any[] = req.body.snippets;
	const delta: any = req.body.delta;

	const reply = await ReplyRepository.findReplyWithPropertiesById(replyId);

	if(!reply) {
		res.send({ reply: null });
		return;
	}

	reply.snippets.forEach(snippet => snippet.remove());

	const { updatedReplyMessage, snippetEntities } = await createSnippetEntitiesFromReplyMessage(replyMessage, snippets);

	reply.message = updatedReplyMessage;
	reply.snippets = snippetEntities;
	reply.delta = delta;
	await reply.save();
    
	const replyResponse = await ReplyRepository.findReplyWithPropertiesById(replyId);
	const response = replyResponse ? mapReplyResponse(replyResponse) : null;

	res.send({ reply: response });
};

export const deleteReply = async (req: any, res: any) => {
	const replyId = req.params.id;

	const reply = await ReplyRepository.findReplyWithPropertiesById(replyId);

	if(!reply) {
		res.send({ reply: null });
		return;
	}

	await reply.remove();

	res.send({ 
		reply: {
			id: replyId
		}
	});
};