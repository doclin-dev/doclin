import { CopilotMessage } from '../types';
import { createAxiosInstance } from './apiService';

const getBaseCopilotUrl = (organizationId: string, projectId: number) => {
  return `/organizations/${organizationId}/projects/${projectId}/copilot`;
};

export const postCopilotPrompt = async ({
  organizationId,
  projectId,
  messages,
  activeEditorText,
  referToDoclinThreads,
  referToCodeFile,
}: {
  organizationId: string;
  projectId: number;
  messages: CopilotMessage[];
  activeEditorText: string | undefined;
  referToDoclinThreads: boolean;
  referToCodeFile: boolean;
}) => {
  const data = {
    messages: messages,
    activeEditorText: activeEditorText,
    referToDoclinThreads: referToDoclinThreads,
    referToCodeFile: referToCodeFile,
  };

  const apiService = await createAxiosInstance();
  const baseThreadUrl = getBaseCopilotUrl(organizationId, projectId);
  const response = await apiService.post(baseThreadUrl, data);

  return response;
};
