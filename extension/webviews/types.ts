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
}

export type Thread = {
  id: number;
  message: string;
  projectId: number;
  userId: number;
  __snippets__: any;
  __user__: User;
}