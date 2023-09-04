import { StateManager } from "../StateManager";
import { createAxiosInstance } from "./apiService";

const baseThreadUrl = `/threads`;

const getThreads = async (projectId: number, filePath: string) => {
    const params = {
        projectId: projectId,
        filePath: filePath
    };

    const apiService = createAxiosInstance(StateManager.getState(StateManager.type.AUTH_TOKEN));
    const response = await apiService.get(baseThreadUrl, { params });

    return response;
}

const postThread = async (
    threadMessage: string, 
    projectId: number,
    activeEditorFilePath: string
) => {
    const data = {
        threadMessage: threadMessage,
        projectId: projectId,
        filePath: activeEditorFilePath
    };

    const apiService = createAxiosInstance(StateManager.getState(StateManager.type.AUTH_TOKEN));
    const response = await apiService.post(baseThreadUrl, data);

    return response;
}

export default {
    getThreads,
    postThread
}