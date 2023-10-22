import { createAxiosInstance } from "./apiService";

const getBaseThreadUrl = (organizationId: string, projectId: number) => {
    return `/organizations/${organizationId}/projects/${projectId}/threads`;
}

const getThreads = async (organizationId: string, projectId: number, filePath: string) => {
    const params = {
        projectId: projectId,
        filePath: filePath
    };

    const apiService = createAxiosInstance();
    const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
    const response = await apiService.get(baseThreadUrl, { params });

    return response;
}

const postThread = async (organizationId: string,
                          projectId: number, 
                          threadMessage: string, 
                          activeEditorFilePath: string,
                          anonymous: boolean) => {
    const data = {
        threadMessage: threadMessage,
        projectId: projectId,
        activeEditorFilePath: activeEditorFilePath,
        anonymous: anonymous
    };

    const apiService = createAxiosInstance();
    const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
    const response = await apiService.post(baseThreadUrl, data);

    return response;
}

const updateThread = async (organizationId: string, 
                            projectId: number, 
                            threadId: number, 
                            threadMessage: string, 
                            activeEditorFilePath: string) => {
    const data = {
        message: threadMessage,
        activeEditorFilePath: activeEditorFilePath
    };

    const apiService = createAxiosInstance();
    const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
    const response = await apiService.put(`${baseThreadUrl}/${threadId}`, data);

    return response;
}

const deleteThread = async(organizationId: string, projectId: number, threadId: number) => {
    const apiService = createAxiosInstance();
    const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
    const response = await apiService.delete(`${baseThreadUrl}/${threadId}`);

    return response;
}

export default {
    getThreads,
    postThread,
    updateThread,
    deleteThread
}