import * as vscode from 'vscode';

export type DoclinFile = {
    organizationId: string | null;
    projectId: number | null;
};

export type Organization = {
    organizationId: number;

};

export type Thread = {
    id: number;
    title: string;
    snippets: Snippet[];
    message: string;
    delta: any;
    displayMessage: string;
    username: string;
    replyCount: number;
    threadCreationTime: Date;
    lastReplied: Date;
    filePath: string;
    gitBranch: string;
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
    updatedRange: vscode.Range;
    outdated: boolean;
    gitBranch: string;
};

export type PostThread = {
    title: string;
    threadMessage: string;
    delta: any;
    snippets: any[];
    mentionedUserIds: number[];
    anonymous: boolean;
    isFileThreadSelected: boolean;
    gitBranch: string;
};

export type UpdateThread = {
    title: string;
    threadMessage: string; 
    threadId: number;
    snippets: any[];
    delta: any;
};

export type PostReply = {
    replyMessage: string;
    threadId: number;
    anonymous: boolean;
    snippets: any[];
    delta: any;
    mentionedUserIds: number[];
};

export type UpdateReply = {
    replyMessage: string;
    replyId: number;
    snippets: any[];
    delta: any;
};

export type WebviewMessageFunction = (value: any) => any | Promise<any>;

export type WebviewMessage = { type: any, value: any };

export type User = {
    username: string;
};

export type ExtensionState = {
    user?: User | undefined;
    organization?: any;
    project?: any;
    githubUrl?: string;
    isFolderOrFileOpened?: boolean;
    error?: any;
};