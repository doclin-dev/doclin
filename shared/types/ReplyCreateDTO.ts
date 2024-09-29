import { SnippetRequestDTO } from './SnippetRequestDTO';

export interface ReplyCreateDTO {
  message: string;
  delta: any;
  snippets: SnippetRequestDTO[];
  mentionedUserIds: number[];
  anonymous: boolean;
}
