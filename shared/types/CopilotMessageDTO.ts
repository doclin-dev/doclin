import type { CopilotRole } from '../enums/CopilotRole';

export interface CopilotMessageDTO {
  role: CopilotRole;
  content: string;
}
