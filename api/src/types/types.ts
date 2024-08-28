import { CopilotRole } from './enums';

export type CopilotMessage = {
  role: CopilotRole;
  content: string;
};
