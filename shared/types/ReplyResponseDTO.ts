import { SnippetResponseDTO } from './SnippetResponseDTO';

export interface ReplyResponseDTO {
  id: number;
  snippets: SnippetResponseDTO[];
  message: string;
  delta: any;
  username: string;
  createdAt: Date;
  canEdit: boolean;
}
