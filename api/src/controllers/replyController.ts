import { ReplySnippet } from "../database/entities/ReplySnippet";
import { Reply } from "../database/entities/Reply";
import { ReplyRepository } from "../database/repositories/ReplyRepository";
import { ThreadRepository } from "../database/repositories/ThreadRepository";
import { MULTIPLE_LINE_BREAK_REGEX, SINGLE_LINE_BREAK, getSnippetTag } from "./utils/snippetUtils";
import { mapReplyResponse } from "./utils/mapperUtils";

const ANONYMOUS_USER = "Anonymous User"

export const postReply = async (req: any, res: any) => {
    const threadId = req.params.threadId;
    const replyMessage = req.body.replyMessage;
    const thread = await ThreadRepository.findThreadById(threadId);
    const anonymous = req.body.anonymous;
    const snippets = req.body.snippets;
    const delta = req.body.delta;

    console.log(snippets);
    console.log(delta);

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

    const replyResponse = await ReplyRepository.findReplyWithPropertiesById(reply.id);

    const response = replyResponse ? mapReplyResponse(replyResponse) : null;
 
    res.send({ reply: response });
};

const createSnippetEntitiesFromReplyMessage = async (replyMessage: string, snippetblots: any[]) => {
    let updatedReplyMessage: string = "";

    updatedReplyMessage = replyMessage.replace(MULTIPLE_LINE_BREAK_REGEX, SINGLE_LINE_BREAK)

    const snippetEntities = [];

    for (const snippetblot of snippetblots) {
        const snippet: ReplySnippet = new ReplySnippet();
        snippet.text = snippetblot.originalSnippet;
        snippet.filePath = snippetblot.filePath;
        snippet.lineStart = snippetblot.lineStart;
        
        await snippet.save();

        snippetEntities.push(snippet);

        updatedReplyMessage = updatedReplyMessage.replace(getSnippetTag(snippetblot.index), getSnippetTag(snippet.id));
    }

    return { updatedReplyMessage, snippetEntities }; 
}

export const getReplies = async (req: any, res: any) => {
    const threadId = req.params.threadId;

    const replies = await ReplyRepository.findRepliesWithPropertiesByThreadId(threadId);
    
    const response = replies.map(mapReplyResponse);

    res.send({ replies: response });
}

export const updateReplyMessage = async (req: any, res: any) => {
    const replyId = req.params.id;
    const replyMessage = req.body.message;

    const reply = await ReplyRepository.findReplyWithPropertiesById(replyId);

    if(!reply) {
        res.send({ reply: null });
        return;
    }

    reply.message = replyMessage;
    await reply.save();
    const username = reply?.anonymous ? ANONYMOUS_USER : reply?.user?.name;
    
    const response = {
        id: reply?.id,
        threadId: reply?.threadId,
        message: reply?.message,
        username: username
    }

    res.send({ reply: response });
}

export const deleteReply = async (req: any, res: any) => {
    const replyId = req.params.id;

    const reply = await ReplyRepository.findReplyWithPropertiesById(replyId);

    if(!reply) {
        res.send({ reply: null });
        return;
    }

    await reply.remove();

    res.send("Reply sucessfully deleted");
}