import * as vscode from 'vscode';
import * as copilotApi from '../api/copilotApi';
import logger from '../utils/logger';
import { readDoclinFile } from './doclinFile/readDoclinFile';

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

    return response?.data?.reply;
  } catch (e: any) {
    logger.error(e);
    return 'An error occurred';
  }
};
