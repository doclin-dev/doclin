import { Reply } from "../database/entities/Reply";
import { ReplyRepository } from "../database/repositories/ReplyRepository";
import { ThreadRepository } from "../database/repositories/ThreadRepository";

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
    
    const response = {
        id: responseReply?.id,
        threadId: responseReply?.threadId,
        message: responseReply?.message,
        userId: responseReply?.user?.id,
        username: responseReply?.user?.name,
        anonymous: responseReply?.anonymous
    }
 
    res.send({ reply: response });
};

export const getReplies = async (req: any, res: any) => {
    const threadId = req.params.threadId;

    const replies = await ReplyRepository.findRepliesByThreadId(threadId);
    
    const response = replies.map((reply) => ({
        id: reply.id,
        message: reply.message,
        username: reply.user?.name,
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
    
    const response = {
        id: reply?.id,
        threadId: reply?.threadId,
        message: reply?.message,
        userId: reply?.user?.id,
        username: reply?.user?.name
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