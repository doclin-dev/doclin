import { SnippetDTO } from './SnippetResponseDTO';

export interface ReplyDTO {
  id: number;
  snippets: SnippetDTO[];
  message: string;
  delta: any;
  username: string;
  createdAt: Date;
}
