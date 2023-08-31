import { SnippetFilePath } from "../entities/SnippetFilePath";
import { Thread } from "../entities/Thread";
import { Snippet } from "../entities/Snippet";

export const postThread = async (req: any, res: any) => {
    const threadMessage: string = req.body.message;
    const userId: number = req.userId;
    const projectId: number = req.body.projectId;
    const activeEditorFilePath: string = req.body.activeEditorFilePath;
    
    const snippetsMatcher: RegExp = /<pre\b[^>]*>([\s\S]*?)<\/pre>/g;
    const filePaths: string[] = [];
    const snippets: string[] = [];
    let count = -1;

    let updatedThreadMessage: string = threadMessage.replace(snippetsMatcher, (_match: string, content: string) => {
        const codeBlockLines: string[] = content.split("\n");
        
        if (codeBlockLines.length > 0) {
            let filePath: string;
            const filePathPrefix = "File Path: ";

            if (codeBlockLines[0]?.startsWith(filePathPrefix)) {
                filePath = codeBlockLines.shift()?.substring(filePathPrefix.length) || "";
            } else {
                filePath = activeEditorFilePath;
            }

            filePaths.push(filePath);
            
            const snippetText: string = codeBlockLines.join("\n");
            snippets.push(snippetText);

            count += 1;

            return getSnippetTag(count);
        }

        return content;
    });

    const thread = await Thread.create({
        message: "",
        userId: userId,
        projectId: projectId
    }).save();

    for(let i = 0; i < snippets.length; i++) {
        const snippet: Snippet = await Snippet.create({
            text: snippets[i],
            threadId: thread.id
        }).save();

        await SnippetFilePath.create({
            filePath: filePaths[i],
            snippetId: snippet.id
        }).save();

        updatedThreadMessage = updatedThreadMessage.replace(getSnippetTag(i), getSnippetTag(snippet.id));
    }

    thread.message = updatedThreadMessage;
    await thread.save();

    (await thread.snippets).fill;

    for (const snippet of await thread.snippets) {
        (await snippet.snippetFilePaths).fill;
    }

    res.send({ thread });
}

const getSnippetTag = (snippetId: number) => {
    return `[snippet_${snippetId}]`;
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

    await thread.remove();

    res.send("thread sucessfully deleted");
}