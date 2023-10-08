import { Reply } from "../database/entities/Reply";
import { ReplyRepository } from "../database/repositories/ReplyRepository";
import { ThreadRepository } from "../database/repositories/ThreadRepository";

const ANONYMOUS_USER = "Anonymous User"

export const postReply = async (req: any, res: any) => {
    const threadId = req.params.threadId;
    const replyMessage = req.body.replyMessage;
    const thread = await ThreadRepository.findThreadById(threadId);
    const anonymous = req.body.anonymous;

    if(!thread) {
        res.send({ reply: null });
        return;
    }
    
    const reply = await Reply.create({
        threadId: threadId,
        message: replyMessage,
        userId: req.userId,
        anonymous: anonymous
    }).save();

    const responseReply = await ReplyRepository.findReplyById(reply.id);
    const username = responseReply?.anonymous ? ANONYMOUS_USER : responseReply?.user?.name;
    
    const response = {
        id: responseReply?.id,
        threadId: responseReply?.threadId,
        message: responseReply?.message,
        username: username
    }
 
    res.send({ reply: response });
};

export const getReplies = async (req: any, res: any) => {
    const threadId = req.params.threadId;

    const replies = await ReplyRepository.findRepliesByThreadId(threadId);
    
    const response = replies.map((reply) => ({
        id: reply.id,
        message: reply.message,
        username: reply.anonymous ? ANONYMOUS_USER : reply.user?.name,
        threadId: reply.threadId
    }));

    res.send({ replies: response });
}

export const updateReplyMessage = async (req: any, res: any) => {
    const replyId = req.params.id;
    const replyMessage = req.body.message;

    const reply = await ReplyRepository.findReplyById(replyId);

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

    const reply = await ReplyRepository.findReplyById(replyId);

    if(!reply) {
        res.send({ reply: null });
        return;
    }

    await reply.remove();

    res.send("Reply sucessfully deleted");
}