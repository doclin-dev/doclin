import * as copilotApi from '../api/copilotApi';
import logger from '../utils/logger';
import { readDoclinFile } from './doclinFile/readDoclinFile';

export const copilotPrompt = async (message: {
  prompt: string;
  referToDoclinThreads: boolean;
  referToCodeFile: boolean;
}) => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile.organizationId;
  const projectId = doclinFile.projectId;

  if (!organizationId || !projectId) {
    return;
  }

  try {
    const response = await copilotApi.postCopilotPrompt({ organizationId, projectId, ...message });
    return response?.data?.reply;
  } catch (e: any) {
    logger.error(e);
    return 'An error occurred';
  }
};
