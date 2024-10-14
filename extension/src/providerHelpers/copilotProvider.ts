import * as vscode from 'vscode';
import logger from '../utils/logger';
import { readDoclinFile } from './doclinFile/readDoclinFile';
import { apiService } from '../apiService';
import { CopilotMessageDTO } from '$shared/types/CopilotMessageDTO';

export const postCopilotPrompt = async (webviewMessage: {
  messages: CopilotMessageDTO[];
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
    const response = await apiService.copilot.postCopilotPrompt(organizationId, projectId, {
      activeEditorText,
      ...webviewMessage,
    });

    return response?.data?.reply;
  } catch (e: any) {
    logger.error(e);
    return 'An error occurred';
  }
};
