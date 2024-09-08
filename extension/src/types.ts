import * as vscode from 'vscode';
import { UserDTO } from '../../shared/types/UserDTO';

export interface DoclinFile {
  organizationId: string | null;
  projectId: number | null;
}

export interface Thread {
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
  lastReplied?: Date;
  filePath: string;
  gitBranch?: string;
  canEdit: boolean;
}

export interface Reply {
  id: number;
  snippets: Snippet[];
  message: string;
  delta: any;
  displayMessage: string;
  hoverMessage: string;
  username: string;
  createdAt: Date;
  displayCreationTime: string;
  canEdit: boolean;
}

export interface Snippet {
  id: number;
  text: string;
  filePath: string;
  lineStart: number;
  updatedRange: vscode.Range;
  outdated: boolean;
  gitBranch: string;
}

export interface PostSnippetBlot {
  displaySnippet: string;
  filePath: string;
  gitBranch: string;
  index: number;
  lineStart: number;
  originalSnippet: string;
}

export interface PostThread {
  title: string;
  threadMessage: string;
  delta: any;
  snippets: PostSnippetBlot[];
  mentionedUserIds: number[];
  anonymous: boolean;
  isFileThreadSelected: boolean;
  gitBranch: string;
}

export interface UpdateThread {
  title: string;
  threadMessage: string;
  threadId: number;
  snippets: PostSnippetBlot[];
  delta: any;
}

export interface PostReply {
  replyMessage: string;
  threadId: number;
  anonymous: boolean;
  snippets: PostSnippetBlot[];
  delta: any;
  mentionedUserIds: number[];
}

export interface UpdateReply {
  replyMessage: string;
  replyId: number;
  snippets: PostSnippetBlot[];
  delta: any;
}

export type WebviewMessageFunction = (value: any) => any | Promise<any>;

export interface WebviewMessage {
  type: any;
  value: any;
}

export interface ExtensionState {
  user?: UserDTO | undefined;
  organization?: any;
  project?: any;
  isFolderOrFileOpened?: boolean;
  error?: any;
}
