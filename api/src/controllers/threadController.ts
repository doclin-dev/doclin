import { Thread } from "../entities/Thread";
import { Comment } from "../entities/Comment";

export const post = async (req: any, res: any) => {
    const thread = await Thread.create({
        message: req.body.message,
        userId: req.userId,
        filePath: req.body.filePath,
    }).save();

    res.send({ thread });
}

export const get = async (req: any, res: any) => {
    const filepath = req.query.filePath;
    let threads;

    if (filepath == null) {
        threads = await Thread.find();
    } else {
        threads = await Thread.find({filePath:filepath});
    }

    if (!threads) {
        res.send({ threads : null });
        return;
    };

    res.send ({threads});
}

export const postComment = async (req: any, res: any) => {
    const threadId = req.params.id;
    const thread = await Thread.findOne(threadId);
    if(!thread) {
        res.send({thread: null});
        return;
    }
    
    const comment = await Comment.create({
        threadId: threadId,
        message: thread.message,
        userId: req.userId,
    }).save();

    res.send({comment});
};