import { Thread } from "../entities/Thread";
const DOMParser = require('dom-parser');

export const postThread = async (req: any, res: any) => {
    let threadMessage = req.body.message;
    const userId = req.userId;
    const projectId = req.body.projectId;

    const preTagContents: string[] = [];
    console.log("test run", threadMessage);

    threadMessage = threadMessage.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/g, (match: string, content: string) => {
        preTagContents.push(content);
        return "snippet";
    });

    console.log(preTagContents);

    const thread = await Thread.create({
        message: threadMessage,
        userId: userId,
        projectId: projectId
    }).save();

    // await SnippetFilePath.create({
    //     snippetId: snippet.id,
    //     filePath: req.body.filePath,
    // }).save();

    res.send({ thread });
}

export const getThreads = async (req: any, res: any) => {
    const filePath = req.query.filePath;
    const projectId = req.query.projectId;

    let threads = await Thread.createQueryBuilder('thread')
                              .leftJoinAndSelect('thread.snippets', 'snippet')
                              .leftJoinAndSelect('snippet.snippetFilePaths', 'snippetFilePath')
                              .leftJoinAndSelect('thread.user', 'user')
                              .where('snippetFilePath.filePath = :filePath', { filePath })
                              .andWhere('thread.projectId = :projectId', { projectId })
                              .orderBy('thread.id', 'DESC')
                              .getMany();

    res.send({threads});
}

export const updateThreadMessage = async (req: any, res: any) => {
    const threadId = req.params.id;

    const thread = await Thread.findOne(threadId);
    if(!thread) {
        res.send({thread: null});
        return;
    }

    const threadMessage = req.body.message;

    thread.message = threadMessage;
    await thread.save();

    res.send({thread});
}

export const deleteThread = async (req: any, res: any) => {
    const threadId = req.params.id;

    const thread = await Thread.findOne(threadId);

    if(!thread) {
        res.send({thread: null});
        return;
    }

    const snippets = await thread.snippets;

    for (let snippet of snippets) {
        const snippetFilePaths = await snippet.snippetFilePaths;

        for (let snippetFilePath of snippetFilePaths) {
            await snippetFilePath.remove();
        }

        await snippet.remove();
    }

    await thread.remove();

    res.send("thread sucessfully deleted");
}