import { GlobalStateManager } from "../GlobalStateManager";
import { createAxiosInstance } from "./apiService";

const baseReplyUrl = `/replies`;

const getReplies = async (threadId: number) => {
    const params = {
        threadId: threadId
    };

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.get(baseReplyUrl, { params });

    return response;
}

const postReply = async (replyMessage: string, threadId: number) => {
    const data = {
        replyMessage: replyMessage,
        threadId: threadId
    };

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.post(baseReplyUrl, data);

    return response;
}

const updateReply = async(replyId: number, threadMessage: string) => {
    const data = {
        message: threadMessage
    };

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.put(`${baseReplyUrl}/${replyId}`, data);

    return response;
}

const deleteReply = async(replyId: number) => {
    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.delete(`${baseReplyUrl}/${replyId}`);

    return response;
}

export default {
    getReplies,
    postReply,
    updateReply,
    deleteReply
}