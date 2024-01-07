import { SnippetFilePath } from "../database/entities/SnippetFilePath";
import { Thread } from "../database/entities/Thread";
import { Snippet } from "../database/entities/Snippet";
import { ThreadRepository } from "../database/repositories/ThreadRepository";
import { getSnippetTag, getFilePathFromCodeBlock, getLineStartFromCodeBlock } from "./utils/snippetComparisonUtil";

const ANONYMOUS_USER: string = "Anonymous User";
const CODE_BLOCK_REGEX: RegExp = /<pre\b[^>]*>([\s\S]*?)<\/pre>/g;
const MULTIPLE_LINE_BREAK_REGEX: RegExp = /(<p><br><\/p>)+/gi;
const SINGLE_LINE_BREAK: string = '<p><br></p>';

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
    
    const response = mapThreadResponse(responseThread);

    res.send({ thread: response });
}

const createSnippetEntitiesFromThreadMessage = async (threadMessage: string, activeEditorFilePath: string) => {
    const filePaths: string[] = [];
    const snippets: string[] = [];
    const lineStarts: number[] = [];

    let count = -1;
    let updatedThreadMessage: string = "";

    updatedThreadMessage = threadMessage.replace(MULTIPLE_LINE_BREAK_REGEX, SINGLE_LINE_BREAK)

    updatedThreadMessage = updatedThreadMessage.replace(CODE_BLOCK_REGEX, (_match: string, content: string) => {
        const codeBlockLines: string[] = content.split("\n");
        
        if (codeBlockLines.length > 0) {
            const filePath: string = getFilePathFromCodeBlock(codeBlockLines, activeEditorFilePath);
            const lineStart: number = getLineStartFromCodeBlock(codeBlockLines);

            filePaths.push(filePath);
            lineStarts.push(lineStart);
            
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
        snippetFilePath.lineStart = lineStarts[i];

        const snippet: Snippet = new Snippet();
        snippet.text = snippets[i];
        snippet.snippetFilePaths = [snippetFilePath];
        
        await snippet.save();

        snippetEntities.push(snippet);

        updatedThreadMessage = updatedThreadMessage.replace(getSnippetTag(i), getSnippetTag(snippet.id));
    }

    return { updatedThreadMessage, snippetEntities }; 
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

    const response = threads.map(mapThreadResponse);

    res.send({ threads: response });
}

const mapThreadResponse = (thread: Thread) => {
    return {
        id: thread.id,
        message: thread.message,
        username: thread.anonymous ? ANONYMOUS_USER : thread.user?.name,
        replyCount: thread.replyCount,
        threadCreationTime : thread.createdAt,
        lastReplied: thread.replies.length > 0 ? thread.replies[0].createdAt : null,
        snippets: thread.snippets.map(mapSnippetResponse),
    }
}

const mapSnippetResponse = (snippet: Snippet) => {
    return {
        id: snippet.id,
        text: snippet.text,
        filePath: snippet.snippetFilePaths[0].filePath,
        lineStart: snippet.snippetFilePaths[0].lineStart,
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

    const response = mapThreadResponse(thread);

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