export type User = {
  id: string;
  name: string;
  githubId: string;
};

export type Project = {
  name: string;
  url: string;
  userId: number;
}