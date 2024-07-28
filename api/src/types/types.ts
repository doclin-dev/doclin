import { CopilotRole } from './enums';

export type RequestSnippetBlot = {
  displaySnippet: string;
  filePath: string;
  gitBranch: string;
  index: number;
  lineStart: number;
  originalSnippet: string;
};

export type CopilotMessage = {
  role: CopilotRole;
  content: string;
};
