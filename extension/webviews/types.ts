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