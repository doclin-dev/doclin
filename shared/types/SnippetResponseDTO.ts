export interface SnippetDTO {
  id: number;
  text: string;
  filePath: string | null;
  lineStart: number | null;
  gitBranch: string;
}
