import * as copilotApi from '../api/copilotApi';
import { CopilotMessage } from '../types';
import CopilotMessageCacheManager from '../utils/cache/CopilotMessagesCacheManager';
import logger from '../utils/logger';
import { readDoclinFile } from './doclinFile/readDoclinFile';

const cacheManager = new CopilotMessageCacheManager();
const ALL_MESSAGES = 'allMessages';

export const postCopilotPrompt = async (webviewMessage: {
  prompt: string;
  referToDoclinThreads: boolean;
  referToCodeFile: boolean;
}) => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile.organizationId;
  const projectId = doclinFile.projectId;

  if (!organizationId || !projectId) {
    logger.error('Must complete organization and project setup before using copilot!', true);
    return;
  }

  try {
    const response = await copilotApi.postCopilotPrompt({ organizationId, projectId, ...webviewMessage });
    const responseMessage = response?.data?.reply;

    let cachedMessages = (await cacheManager.get(ALL_MESSAGES)) ?? [];
    cachedMessages = [
      ...cachedMessages,
      { author: 'user', message: webviewMessage.prompt },
      { author: 'copilot', message: responseMessage },
    ];
    cacheManager.set(ALL_MESSAGES, cachedMessages);

    return responseMessage;
  } catch (e: any) {
    logger.error(e);
    return 'An error occurred';
  }
};

export const getCopilotMessageHistory = async (): Promise<CopilotMessage[]> => {
  return (await cacheManager.get(ALL_MESSAGES)) ?? [];
};

export const clearCopilotMessageHistory = async (): Promise<void> => {
  await cacheManager.set(ALL_MESSAGES, []);
};
