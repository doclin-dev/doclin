import { GlobalStateManager } from "../GlobalStateManager";
import { createAxiosInstance } from "./apiService";

const baseThreadUrl = `/threads`;

const getThreads = async (projectId: number, filePath: string) => {
    const params = {
        projectId: projectId,
        filePath: filePath
    };

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.get(baseThreadUrl, { params });

    return response;
}

const postThread = async (threadMessage: string, projectId: number, activeEditorFilePath: string) => {
    const data = {
        threadMessage: threadMessage,
        projectId: projectId,
        activeEditorFilePath: activeEditorFilePath
    };

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.post(baseThreadUrl, data);

    return response;
}

const updateThread = async(threadId: number, threadMessage: string, activeEditorFilePath: string) => {
    const data = {
        message: threadMessage,
        activeEditorFilePath: activeEditorFilePath
    };

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.put(baseThreadUrl + `/${threadId}`, data);

    return response;
}

const deleteThread = async(threadId: number) => {
    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.delete(baseThreadUrl + `/${threadId}`);

    return response;
}

export default {
    getThreads,
    postThread,
    updateThread,
    deleteThread
}