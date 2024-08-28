import { ReplyDTO } from './ReplyDTO';
import { SnippetDTO } from './SnippetResponseDTO';

export interface ThreadResponseDTO {
  id: number;
  title: string;
  snippets: SnippetDTO[];
  message: string;
  delta: any;
  username: string;
  replyCount: number;
  createdAt: Date;
  lastReplied: Date | null;
  filePath: string;
  gitBranch: string;
  replies: ReplyDTO[];
}
