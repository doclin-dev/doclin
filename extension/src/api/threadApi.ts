import { getCurrentOrganizationId } from "../providerHelpers/organizationProviderHelper";
import { getCurrentProjectId } from "../providerHelpers/projectProviderHelper";
import { createAxiosInstance } from "./apiService";

const getBaseThreadUrl = (): string => {
    const organizationId = getCurrentOrganizationId();
    const projectId = getCurrentProjectId();
    return `/organizations/${organizationId}/projects/${projectId}/threads`;
}

const getThreads = async (projectId: number, filePath: string) => {
    const params = {
        projectId: projectId,
        filePath: filePath
    };

    const apiService = createAxiosInstance();
    const response = await apiService.get(getBaseThreadUrl(), { params });

    return response;
}

const postThread = async (threadMessage: string, projectId: number, activeEditorFilePath: string) => {
    const data = {
        threadMessage: threadMessage,
        projectId: projectId,
        activeEditorFilePath: activeEditorFilePath
    };

    const apiService = createAxiosInstance();
    const response = await apiService.post(getBaseThreadUrl(), data);

    return response;
}

const updateThread = async(threadId: number, threadMessage: string, activeEditorFilePath: string) => {
    const data = {
        message: threadMessage,
        activeEditorFilePath: activeEditorFilePath
    };

    const apiService = createAxiosInstance();
    const response = await apiService.put(`${getBaseThreadUrl()}/${threadId}`, data);

    return response;
}

const deleteThread = async(threadId: number) => {
    const apiService = createAxiosInstance();
    const response = await apiService.delete(`${getBaseThreadUrl()}/${threadId}`);

    return response;
}

export default {
    getThreads,
    postThread,
    updateThread,
    deleteThread
}