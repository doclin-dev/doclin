import { SnippetFilePath } from "../database/entities/SnippetFilePath";
import { Thread } from "../database/entities/Thread";
import { Snippet } from "../database/entities/Snippet";
import { ThreadRepository } from "../database/repositiories/ThreadRepository";

export const postThread = async (req: any, res: any) => {
    const threadMessage: string | undefined = req.body.threadMessage;
    const userId: number = req.userId;
    const projectId: number = req.body.projectId;
    const activeEditorFilePath: string = req.body.activeEditorFilePath;
    
    const snippetsMatcher: RegExp = /<pre\b[^>]*>([\s\S]*?)<\/pre>/g;
    const filePaths: string[] = [];
    const snippets: string[] = [];
    let count = -1;

    let updatedThreadMessage: string = "";
    
    if (threadMessage) {
        updatedThreadMessage = threadMessage.replace(/(<p><br><\/p>)+/gi, '<p><br></p>')

        updatedThreadMessage = updatedThreadMessage.replace(snippetsMatcher, (_match: string, content: string) => {
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
    }

    const thread = await Thread.create({
        message: "",
        userId: userId,
        projectId: projectId
    }).save();

    for (let i = 0; i < snippets.length; i++) {
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

    let responseThread = await ThreadRepository.findThreadWithPropertiesByThreadId(thread.id);
    responseThread = fillUpThreadMessageWithSnippet(responseThread);
    
    const response = {
        id: responseThread.id,
        message: responseThread.message,
        projectId: responseThread.projectId,
        userId: responseThread.user?.id,
        userName: responseThread.user?.name
    }

    res.send({ thread: response });
}

const getSnippetTag = (snippetId: number) => {
    return `[snippet_${snippetId}]`;
}

export const getThreads = async (req: any, res: any) => {
    const filePath = req.query.filePath;
    const projectId = req.query.projectId;

    let threads: Thread[] = await ThreadRepository.findThreadByFilePathAndProjectId(filePath, projectId);

    for (let thread of threads) {
        thread = fillUpThreadMessageWithSnippet(thread);
    };

    const response = threads.map((thread) => ({
            id: thread.id,
            message: thread.message,
            userId: thread.user?.id,
            userName: thread.user?.name
        })
    );

    res.send({ threads: response });
}

const fillUpThreadMessageWithSnippet = (thread: Thread): Thread => {
    for (const snippet of thread.snippets) {
        const snippetFilePaths = snippet.snippetFilePaths;
        const firstSnippetFilePath = snippetFilePaths[0];
        const codeBlock = `<pre class="ql-syntax" spellcheck="false">File Path: ${firstSnippetFilePath.filePath}<hr>${snippet.text}</pre>`;
        thread.message = thread.message.replace(getSnippetTag(snippet.id), codeBlock);
    }

    return thread;
}

export const updateThreadMessage = async (req: any, res: any) => {
    const threadId = req.params.id;
    const threadMessage = req.body.message;

    let thread = await ThreadRepository.findThreadById(threadId);

    if (!thread) {
        res.send({thread: null});
        return;
    }

    thread.message = threadMessage;

    await ThreadRepository.save(thread);

    res.send({ thread: thread });
}

export const deleteThread = async (req: any, res: any) => {
    const threadId = req.params.id;

    const thread = await ThreadRepository.findThreadById(threadId);

    if (!thread) {
        res.send({ thread: null });
        return;
    }

    await thread.remove();

    res.send("thread sucessfully deleted");
}