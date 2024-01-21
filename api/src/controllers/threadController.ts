import { Thread } from "../database/entities/Thread";
import { ThreadSnippet } from "../database/entities/ThreadSnippet";
import { ThreadRepository } from "../database/repositories/ThreadRepository";
import { mapThreadResponse } from "./utils/mapperUtils";
import { MULTIPLE_LINE_BREAK_REGEX, SINGLE_LINE_BREAK, getSnippetTag } from "./utils/snippetUtils";

export const postThread = async (req: any, res: any) => {
    const threadMessage: string = req.body.threadMessage;
    const snippets: any[] = req.body.snippets;
    const delta: any = req.body.delta;
    const userId: number = req.userId;
    const projectId: number = req.body.projectId;
    const anonymousPost: boolean = req.body.anonymous;
    
    let { updatedThreadMessage, snippetEntities } = await createSnippetEntitiesFromThreadMessage(threadMessage, snippets);

    const thread = await Thread.create({
        message: updatedThreadMessage,
        userId: userId,
        projectId: projectId,
        snippets: snippetEntities,
        anonymous: anonymousPost,
        delta: delta
    }).save();

    let threadResponse = await ThreadRepository.findThreadWithPropertiesByThreadId(thread.id);

    const response = threadResponse ? mapThreadResponse(threadResponse) : null;

    res.send({ thread: response });
}

const createSnippetEntitiesFromThreadMessage = async (threadMessage: string, snippetblots: any[]) => {
    let updatedThreadMessage: string = "";

    updatedThreadMessage = threadMessage.replace(MULTIPLE_LINE_BREAK_REGEX, SINGLE_LINE_BREAK)

    const snippetEntities = [];

    for (const snippetblot of snippetblots) {
        const snippet: ThreadSnippet = new ThreadSnippet();
        snippet.text = snippetblot.originalSnippet;
        snippet.filePath = snippetblot.filePath;
        snippet.lineStart = snippetblot.lineStart;
        
        await snippet.save();

        snippetEntities.push(snippet);

        updatedThreadMessage = updatedThreadMessage.replace(getSnippetTag(snippetblot.index), getSnippetTag(snippet.id));
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

export const updateThread = async (req: any, res: any) => {
    const threadId: number = req.params.id;
    const threadMessage: string = req.body.message;
    const snippets: any[] = req.body.snippets;
    const delta: any = req.body.delta;

    const thread: Thread | null = await ThreadRepository.findThreadWithPropertiesByThreadId(threadId);

    if (!thread) {
        res.send({ thread: null });
        return;
    }

    thread.snippets.forEach(snippet => snippet.remove());

    const { updatedThreadMessage, snippetEntities } = await createSnippetEntitiesFromThreadMessage(threadMessage, snippets);

    thread.message = updatedThreadMessage;
    thread.snippets = snippetEntities;
    thread.delta = delta;
    await thread.save();

    const threadResponse = await ThreadRepository.findThreadWithPropertiesByThreadId(threadId);
    const response = threadResponse ? mapThreadResponse(threadResponse) : null;

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