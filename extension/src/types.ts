export type DoclinFile = {
    organizationId: string | undefined;
    projectId: number | undefined;
};

export type Thread = {
    id: number;
    snippets: Snippet[];
    message: string;
    originalMessage: string;
    displayMessage: string;
    username: string;
    replyCount: number;
    threadCreationTime: Date;
    lastReplied: Date;
}

export type Snippet = {
    id: number;
    text: string;
    filePath: string;
    lineStart: number;
    outdated: boolean;
}