import { createAxiosInstance } from "./apiService";

const getBaseThreadUrl = (organizationId: string, projectId: number) => {
	return `/organizations/${organizationId}/projects/${projectId}/threads`;
};

const getFileBasedThreads = async (organizationId: string, projectId: number, filePath: string) => {
	const params = {
		projectId: projectId,
		filePath: filePath
	};

	const apiService = await createAxiosInstance();
	const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
	const response = await apiService.get(baseThreadUrl, { params });

	return response;
};

const getAllThreads = async (organizationId: string, projectId: number) => {
	const params = {
		projectId: projectId,
	};

	const apiService = await createAxiosInstance();
	const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
	const response = await apiService.get(baseThreadUrl, { params });

	return response;
};

const postThread = async (organizationId: string,
	projectId: number,
	title: string,
	threadMessage: string, 
	delta: any,
	snippets: any[],
	activeEditorFilePath: string,
	mentionedUserIds: number[],
	anonymous: boolean) => {

	const data = {
		delta: delta,
		title: title,
		threadMessage: threadMessage,
		snippets: snippets,
		projectId: projectId,
		activeEditorFilePath: activeEditorFilePath,
		mentionedUserIds: mentionedUserIds,
		anonymous: anonymous
	};

	const apiService = await createAxiosInstance();
	const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
	const response = await apiService.post(baseThreadUrl, data);

	return response;
};

const updateThread = async (
	organizationId: string, 
	projectId: number, 
	threadId: number,
	title: string,
	threadMessage: string, 
	delta: any,
	snippets: any[],
	activeEditorFilePath: string) => {

	const data = {
		title: title,
		message: threadMessage,
		activeEditorFilePath: activeEditorFilePath,
		delta: delta,
		snippets: snippets
	};

	const apiService = await createAxiosInstance();
	const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
	const response = await apiService.put(`${baseThreadUrl}/${threadId}`, data);

	return response;
};

const deleteThread = async(organizationId: string, projectId: number, threadId: number) => {
	const apiService = await createAxiosInstance();
	const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
	const response = await apiService.delete(`${baseThreadUrl}/${threadId}`);

	return response;
};

export default {
	getFileBasedThreads,
	getAllThreads,
	postThread,
	updateThread,
	deleteThread
};