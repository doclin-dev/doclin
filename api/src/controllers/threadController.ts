import { Thread } from "../entities/Thread";
import { Comment } from "../entities/Comment";
import { ThreadFile } from "../entities/ThreadFile";

export const postThread = async (req: any, res: any) => {
    const thread = await Thread.create({
        message: req.body.message,
        userId: req.userId,
        projectId: req.body.projectId
    }).save();

    await ThreadFile.create({
        threadId: thread.id,
        filePath: req.body.filePath,
    }).save();

    res.send({ thread });
}

export const getThreads = async (req: any, res: any) => {
    const filePath = req.query.filePath;
    const projectId = req.query.projectId;

    let threads = await Thread.createQueryBuilder('thread')
                              .leftJoinAndSelect('thread.threadFiles', 'threadFile')
                              .leftJoinAndSelect('thread.user', 'user')
                              .where('threadFile.filePath = :filePath', { filePath })
                              .andWhere('thread.projectId = :projectId', { projectId })
                              .orderBy('thread.id', 'DESC')
                              .getMany();

    res.send({threads});
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