import { SnippetFilePath } from "../database/entities/SnippetFilePath";
import { Thread } from "../database/entities/Thread";
import { Snippet } from "../database/entities/Snippet";
import { ThreadRepository } from "../database/repositories/ThreadRepository";

const ANONYMOUS_USER: string = "Anonymous User";


export const postThread = async (req: any, res: any) => {
    const threadMessage: string = req.body.threadMessage;
    const userId: number = req.userId;
    const projectId: number = req.body.projectId;
    const activeEditorFilePath: string = req.body.activeEditorFilePath;
    const anonymousPost: boolean = req.body.anonymous;
    
    let { updatedThreadMessage, snippetEntities } = await createSnippetEntitiesFromThreadMessage(threadMessage, activeEditorFilePath);

    updatedThreadMessage = updatedThreadMessage.trim();

    const thread = await Thread.create({
        message: updatedThreadMessage,
        userId: userId,
        projectId: projectId,
        snippets: snippetEntities,
        anonymous: anonymousPost
    }).save();

    let responseThread = await ThreadRepository.findThreadWithPropertiesByThreadId(thread.id);

    const username = responseThread.anonymous ? ANONYMOUS_USER : responseThread.user?.name;
    
    const response = {
        id: responseThread.id,
        message: responseThread.message,
        projectId: responseThread.projectId,
        username: username
    }

    res.send({ thread: response });
}

const createSnippetEntitiesFromThreadMessage = async (threadMessage: string, activeEditorFilePath: string) => {
    const snippetsMatcher: RegExp = /<pre\b[^>]*>([\s\S]*?)<\/pre>/g;
    const filePaths: string[] = [];
    const snippets: string[] = [];

    let count = -1;
    let updatedThreadMessage: string = "";

    updatedThreadMessage = threadMessage.replace(/(<p><br><\/p>)+/gi, '<p><br></p>')

    updatedThreadMessage = updatedThreadMessage.replace(snippetsMatcher, (_match: string, content: string) => {
        const codeBlockLines: string[] = content.split("\n");
        
        if (codeBlockLines.length > 0) {
            let filePath: string;
            // let lineStart: number;
            const filePathPrefix = "File Path: ";

            if (codeBlockLines[0]?.startsWith(filePathPrefix)) {
                filePath = codeBlockLines.shift()?.substring(filePathPrefix.length) || "";
            } else {
                filePath = activeEditorFilePath;
            }

            // if (codeBlockLines[0]?.startsWith(filePathPrefix)) {
            //     filePath = codeBlockLines.shift()?.substring(filePathPrefix.length) || "";
            // }

            filePaths.push(filePath);
            
            const snippetText: string = codeBlockLines.join("\n");
            snippets.push(snippetText);

            count += 1;

            return getSnippetTag(count);
        }

        return content;
    });

    const snippetEntities = [];

    for (let i = 0; i < snippets.length; i++) {
        const snippetFilePath = new SnippetFilePath();
        snippetFilePath.filePath = filePaths[i];

        const snippet: Snippet = new Snippet();
        snippet.text = snippets[i];
        snippet.snippetFilePaths = [snippetFilePath];
        
        await snippet.save();

        snippetEntities.push(snippet);

        updatedThreadMessage = updatedThreadMessage.replace(getSnippetTag(i), getSnippetTag(snippet.id));
    }

    return { updatedThreadMessage, snippetEntities }; 
}

const getSnippetTag = (snippetId: number) => {
    return `[snippet_${snippetId}]`;
}

export const getThreads = async (req: any, res: any) => {
    const filePath = req.query.filePath;
    const projectId = req.query.projectId;
    let threads: Thread[];

    if (filePath) {
        threads = await ThreadRepository.findThreadByFilePathAndProjectId(filePath, projectId);
    } else {
        threads = await ThreadRepository.findAllThreadsByProjectId(projectId);
    }

    const response = threads.map((thread) => ({
        id: thread.id,
        message: thread.message,
        username: thread.anonymous ? ANONYMOUS_USER : thread.user?.name,
        replyCount: thread.replyCount,
        threadCreationTime : thread.createdAt,
        lastReplied: thread.replies.length > 0 ? thread.replies[0].createdAt : null,
        snippets: thread.snippets.map(getSnippetDTO),
    }));

    res.send({ threads: response });
}

const getSnippetDTO = (snippet: Snippet) => {
    return {
        id: snippet.id,
        text: snippet.text,
        filePath: snippet.snippetFilePaths[0].filePath
    }
}

export const updateThread = async (req: any, res: any) => {
    const threadId = req.params.id;
    const threadMessage = req.body.message;
    const activeEditorFilePath = req.body.activeEditorFilePath;

    const thread = await ThreadRepository.findThreadWithPropertiesByThreadId(threadId);

    if (!thread) {
        res.send({thread: null});
        return;
    }

    thread.snippets.forEach(snippet => snippet.remove());

    const { updatedThreadMessage, snippetEntities } = await createSnippetEntitiesFromThreadMessage(threadMessage, activeEditorFilePath);

    thread.message = updatedThreadMessage;
    thread.snippets = snippetEntities;

    await thread.save();

    const username = thread.anonymous ? ANONYMOUS_USER : thread.user?.name;

    const response = {
        id: thread.id,
        message: thread.message,
        projectId: thread.projectId,
        username: username
    }

    res.send({ thread: response });
}

export const deleteThread = async (req: any, res: any) => {
    const threadId = req.params.id;

    const thread = await ThreadRepository.findThreadById(threadId);

    if (!thread) {
        res.send({ thread: null });
        return;
    }

    await thread.remove();

    res.send("Thread sucessfully deleted");
}