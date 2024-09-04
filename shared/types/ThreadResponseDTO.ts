import { ReplyResponseDTO } from './ReplyResponseDTO';
import { SnippetResponseDTO } from './SnippetResponseDTO';

export interface ThreadResponseDTO {
  id: number;
  title: string;
  snippets: SnippetResponseDTO[];
  message: string;
  delta: any;
  username: string;
  replyCount: number;
  createdAt: Date;
  lastReplied?: Date;
  filePath: string;
  gitBranch?: string;
  replies: ReplyResponseDTO[];
  canEdit: boolean;
}
