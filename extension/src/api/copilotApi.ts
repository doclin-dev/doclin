import { createAxiosInstance } from './apiService';

const getBaseCopilotUrl = (organizationId: string, projectId: number) => {
  return `/organizations/${organizationId}/projects/${projectId}/copilot`;
};

export const postCopilotPrompt = async ({
  organizationId,
  projectId,
  prompt,
  activeEditorText,
  referToDoclinThreads,
  referToCodeFile,
}: {
  organizationId: string;
  projectId: number;
  prompt: string;
  activeEditorText: string | undefined;
  referToDoclinThreads: boolean;
  referToCodeFile: boolean;
}) => {
  const data = {
    prompt: prompt,
    activeEditorText: activeEditorText,
    referToDoclinThreads: referToDoclinThreads,
    referToCodeFile: referToCodeFile,
  };

  const apiService = await createAxiosInstance();
  const baseThreadUrl = getBaseCopilotUrl(organizationId, projectId);
  const response = await apiService.post(baseThreadUrl, data);

  return response;
};
