export type DoclinFile = {
    organizationId: string | null;
    projectId: number | null;
};

export type Thread = {
    id: number;
    snippets: Snippet[];
    message: string;
    delta: any;
    displayMessage: string;
    username: string;
    replyCount: number;
    threadCreationTime: Date;
    lastReplied: Date;
};

export type Reply = {
    id: number;
    snippets: Snippet[];
    message: string;
    delta: any;
    displayMessage: string;
    username: string;
    replyCreationTime: Date;
};

export type Snippet = {
    id: number;
    text: string;
    filePath: string;
    lineStart: number;
    outdated: boolean;
};

export type PostThread = { 
    threadMessage: string, 
    delta: any, 
    snippets: any[], 
    mentionedUserIds: number[],
    anonymous: boolean 
};

export type UpdateThread = {
    threadMessage: string, 
    threadId: number,
    snippets: any[],
    delta: any
};

export type PostReply = {
    replyMessage: string, 
    threadId: number, 
    anonymous: boolean,
    snippets: any[],
    delta: any,
    mentionedUserIds: number[]
};

export type UpdateReply = {
    replyMessage: string, 
    replyId: number,
    snippets: any[],
    delta: any
};