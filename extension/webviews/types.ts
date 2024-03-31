export type User = {
  id: string;
  name: string;
  githubId: string;
  email: string;
};

export type Project = {
  id: number;
  name: string;
  url: string;
  userId: number;
  unauthorized: boolean | undefined;
};

export type Thread = {
  id: number;
  message: string;
  projectId: number;
  userId: number;
  username: string;
  lastReplied: string;
  createdAt: string;
  snippets: any[];
  gitBranch: string;
  filePath: string;
  displayMessage: string;
  title: string;
  replyCount: number;
};

export type Reply = {
  id: number;
  message: string;
  delta: any;
  displayMessage: string;
  hoverMessage: string;
  username: string;
  createdAt: Date;
  displayCreationTime: Date;
};

export type Organization = {
  id: string;
  name: string;
  members: User[];
  unauthorized: boolean | undefined;
};

export type TextEditorInsertSnippet = { 
  filePath: string, 
  lineStart: number, 
  displaySnippet: string, 
  originalSnippet: string,
  gitBranch: string
};