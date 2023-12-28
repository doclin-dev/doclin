export type User = {
  id: string;
  name: string;
  githubId: string;
};

export type Project = {
  id: number;
  name: string;
  url: string;
  userId: number;
};

export type Thread = {
  id: number;
  message: string;
  projectId: number;
  userId: number;
  username: string;
  lastReplied: string;
  threadCreationTime: string;
};

export type Organization = {
  id: string;
  name: string;
};
