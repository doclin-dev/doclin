import { getCurrentOrganizationId } from "../providerHelpers/organizationProviderHelper";
import { getCurrentProjectId } from "../providerHelpers/projectProviderHelper";
import { createAxiosInstance } from "./apiService";

const getBaseReplyUrl = (threadId: number | undefined = undefined): string => {
    const organizationId = getCurrentOrganizationId();
    const projectId = getCurrentProjectId();
    return `/organizations/${organizationId}/projects/${projectId}/threads/${threadId}/replies`;
}

const getReplies = async (threadId: number) => {
    const apiService = createAxiosInstance();
    const response = await apiService.get(getBaseReplyUrl(threadId));

    return response;
}

const postReply = async (replyMessage: string, threadId: number) => {
    const data = {
        replyMessage: replyMessage
    };

    const apiService = createAxiosInstance();
    const response = await apiService.post(getBaseReplyUrl(threadId), data);

    return response;
}

const updateReply = async (replyId: number, threadMessage: string) => {
    const data = {
        message: threadMessage
    };

    const apiService = createAxiosInstance();
    const response = await apiService.put(`${getBaseReplyUrl()}/${replyId}`, data);

    return response;
}

const deleteReply = async (replyId: number) => {
    const apiService = createAxiosInstance();
    const response = await apiService.delete(`${getBaseReplyUrl()}/${replyId}`);

    return response;
}

export default {
    getReplies,
    postReply,
    updateReply,
    deleteReply
}