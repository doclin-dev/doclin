import * as vscode from 'vscode';
import * as copilotApi from '../api/copilotApi';
import { CopilotCache, CopilotIndicators } from '../types';
import CopilotMessageCacheManager from '../utils/cache/CopilotMessagesCacheManager';
import CopilotIndicatorCacheManager from '../utils/cache/CopilotIndicatorCacheManager';
import logger from '../utils/logger';
import { readDoclinFile } from './doclinFile/readDoclinFile';

const messageCacheManager = new CopilotMessageCacheManager();
const indicatorCacheManager = new CopilotIndicatorCacheManager();
const ALL_MESSAGES = 'allMessages';
const ALL_INDICATORS = 'allIndicators';

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
    const activeEditorText = vscode.window.activeTextEditor?.document.getText();
    const response = await copilotApi.postCopilotPrompt({
      organizationId,
      projectId,
      activeEditorText,
      ...webviewMessage,
    });
    const responseMessage = response?.data?.reply;

    let cachedMessages = (await messageCacheManager.get(ALL_MESSAGES)) ?? [];
    cachedMessages = [
      ...cachedMessages,
      { author: 'user', message: webviewMessage.prompt },
      { author: 'copilot', message: responseMessage },
    ];
    messageCacheManager.set(ALL_MESSAGES, cachedMessages);

    return responseMessage;
  } catch (e: any) {
    logger.error(e);
    return 'An error occurred';
  }
};

export const getCopilotCache = async (): Promise<CopilotCache> => {
  const messages = (await messageCacheManager.get(ALL_MESSAGES)) ?? [];
  const indicators = (await indicatorCacheManager.get(ALL_INDICATORS)) ?? createCopilotIndicators();

  return { messages, indicators };
};

const createCopilotIndicators = (): CopilotIndicators => {
  return {
    referToDoclinThreads: true,
    referToCurrentlyOpenFile: true,
  };
};

export const clearCopilotMessageHistory = async (): Promise<void> => {
  await messageCacheManager.set(ALL_MESSAGES, []);
};

export const updateCopilotIndicatorsCache = async (copilotIndicators: CopilotIndicators): Promise<void> => {
  await indicatorCacheManager.set(ALL_INDICATORS, copilotIndicators);
};
