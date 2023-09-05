import { Thread } from "../database/entities/Thread";
import { Reply } from "../database/entities/Reply";

export const postReply = async (req: any, res: any) => {
    const threadId = req.params.threadId;
    const replyMessage = req.body.message;
    const thread = await Thread.findOne({ where: {id: threadId }});

    if(!thread) {
        res.send({thread: null});
        return;
    }
    
    const reply = await Reply.create({
        threadId: threadId,
        message: replyMessage,
        userId: req.userId,
    }).save();
 
    res.send({reply});
};

export const getReplies = async (req: any, res: any) => {
    const threadId = req.params.threadId;
    const replies = await Reply.find({ 
        where: { threadId: parseInt(threadId) }
    });

    if(!replies) {
        res.send({replies: null});
        return;
    }
    
    res.send({replies});
}

export const updateReplyMessage = async (req: any, res: any) => {
    const replyId = req.params.id;

    const reply = await Reply.findOne({ where: {id: replyId }});
    if(!reply) {
        res.send({reply: null});
        return;
    }

    const replyMessage = req.body.message;

    reply.message = replyMessage;
    await reply.save();

    res.send({reply});
}

export const deleteReply = async (req: any, res: any) => {
    const replyId = req.params.id;

    const reply = await Reply.findOne({ where: {id: replyId }});
    if(!reply) {
        res.send({reply: null});
        return;
    }

    await reply.remove();

    res.send("Reply sucessfully deleted");
}