import { Thread } from "../entities/Thread";
import { Reply } from "../entities/Reply";


export const postReply = async (req: any, res: any) => {
    const threadId = req.params.threadId;
    const replyMessage = req.body.message;
    console.log('r',replyMessage);
    const thread = await Thread.findOne(threadId);
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
    const replies = await Reply.find(
        {threadId: parseInt(threadId)}
    );

    if(!replies) {
        res.send({replies: null});
        return;
    }
    
    res.send({replies});
}