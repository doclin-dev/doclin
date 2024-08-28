import { SnippetRequestDTO } from './SnippetRequestDTO';

export interface ThreadRequestDTO {
  title: string;
  message: string;
  delta: any;
  snippets: SnippetRequestDTO[];
  gitBranch?: string;
  filePath?: string;
  mentionedUserIds: number[];
  anonymous: boolean;
}
