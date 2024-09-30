export interface SnippetRequestDTO {
  displaySnippet: string;
  filePath: string;
  gitBranch: string;
  index: number;
  lineStart: number;
  originalSnippet: string;
}
