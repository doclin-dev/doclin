import { SnippetRequestDTO } from './SnippetRequestDTO';

export interface ThreadUpdateDTO {
  title: string;
  message: string;
  snippets: SnippetRequestDTO[];
  delta: any;
}
