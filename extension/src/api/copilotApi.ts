import { createAxiosInstance } from "./apiService";

const getBaseCopilotUrl = (organizationId: string, projectId: number) => {
	return `/organizations/${organizationId}/projects/${projectId}/copilot`;
};

const postCopilotPrompt = async (
	organizationId: string,
	projectId: number,
	prompt: string
) => {

	const data = {
		prompt: prompt,
	};

	const apiService = await createAxiosInstance();
	const baseThreadUrl = getBaseCopilotUrl(organizationId, projectId);
	const response = await apiService.post(baseThreadUrl, data);

	return response;
};

export default {
	postCopilotPrompt
};