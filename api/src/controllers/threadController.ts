import { Thread } from "../entities/Thread";
import { Comment } from "../entities/Comment";
import { ThreadFile } from "../entities/ThreadFile";

export const postThread = async (req: any, res: any) => {
    const thread = await Thread.create({
        message: req.body.message,
        userId: req.userId,
        projectId: req.body.projectId
    }).save();

    const threadFile = await ThreadFile.create({
        threadId: thread.id,
        filePath: req.body.filePath,
    }).save();

    res.send({ thread });
}

export const getThreads = async (req: any, res: any) => {
    const filePath = req.query.filePath;
    let options: any = {
        projectId: req.query.projectId
    }

    if (filePath != null) {
        options = {...options, filePath};
    }

    let threadFiles = await Thread.createQueryBuilder('thread')
                                      .leftJoinAndSelect('thread.threadFiles', 'threadFile')
                                      .leftJoinAndSelect('thread.user', 'user')
                                      .where('threadFile.filePath = :filePath', { filePath: filePath })
                                      .orderBy('thread.id', 'DESC')
                                      .getMany();

    res.send({
        test: "Hello",
        threads: threadFiles,
        filePath: filePath?filePath:"not defined"
    });
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