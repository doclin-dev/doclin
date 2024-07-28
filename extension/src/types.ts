import * as vscode from 'vscode';

export type DoclinFile = {
  organizationId: string | null;
  projectId: number | null;
};

export type Organization = {
  id: string;
  name?: string;
  members?: User[];
  unauthorized?: boolean;
};

export type Project = {
  id?: number;
  name?: string;
  url?: string;
  userId?: number;
  unauthorized?: boolean;
};

export type Thread = {
  id: number;
  title: string;
  snippets: Snippet[];
  message: string;
  delta: any;
  displayMessage: string;
  hoverMessage: string;
  username: string;
  replyCount: number;
  createdAt: Date;
  displayCreationTime: string;
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
  hoverMessage: string;
  username: string;
  createdAt: Date;
  displayCreationTime: string;
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

export type PostSnippetBlot = {
  displaySnippet: string;
  filePath: string;
  gitBranch: string;
  index: number;
  lineStart: number;
  originalSnippet: string;
};

export type PostThread = {
  title: string;
  threadMessage: string;
  delta: any;
  snippets: PostSnippetBlot[];
  mentionedUserIds: number[];
  anonymous: boolean;
  isFileThreadSelected: boolean;
  gitBranch: string;
};

export type UpdateThread = {
  title: string;
  threadMessage: string;
  threadId: number;
  snippets: PostSnippetBlot[];
  delta: any;
};

export type PostReply = {
  replyMessage: string;
  threadId: number;
  anonymous: boolean;
  snippets: PostSnippetBlot[];
  delta: any;
  mentionedUserIds: number[];
};

export type UpdateReply = {
  replyMessage: string;
  replyId: number;
  snippets: PostSnippetBlot[];
  delta: any;
};

export type WebviewMessageFunction = (value: any) => any | Promise<any>;

export type WebviewMessage = {
  type: any;
  value: any;
};

export type User = {
  id: number;
  name: string;
  email: string;
  githubId: number;
};

export type ExtensionState = {
  user?: User | undefined;
  organization?: any;
  project?: any;
  isFolderOrFileOpened?: boolean;
  error?: any;
};

export type CopilotMessage = {
  author: 'user' | 'copilot';
  message: string;
};
