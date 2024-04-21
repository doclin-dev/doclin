import copilotApi from "../api/copilotApi";
import { readDoclinFile } from "./doclinFile/readDoclinFile";

export const copilotPrompt = async (prompt: string) => {
	const doclinFile = await readDoclinFile();
	const organizationId = doclinFile.organizationId;
	const projectId = doclinFile.projectId;
	
	if (!organizationId || !projectId) {
		return;
	}

	const response = await copilotApi.postCopilotPrompt(
		organizationId, 
		projectId,
		prompt
	);
  
	return response?.data?.reply;
};