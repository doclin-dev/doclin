import { CopilotMessageDTO } from './CopilotMessageDTO';

export interface CopilotRequestDTO {
  messages: CopilotMessageDTO[];
  activeEditorText: string | undefined;
  referToDoclinThreads: boolean;
  referToCodeFile: boolean;
}
