import { createAxiosInstance } from "./apiService";

const getBaseReplyUrl = async (organizationId: string,
                               projectId: number,
                               threadId: number | undefined = undefined): Promise<string> => {
    return `/organizations/${organizationId}/projects/${projectId}/threads/${threadId}/replies`;
}

const getReplies = async (organizationId: string, projectId: number, threadId: number) => {
    const apiService = createAxiosInstance();
    const baseReplyUrl = await getBaseReplyUrl(organizationId, projectId, threadId);
    const response = await apiService.get(baseReplyUrl);

    return response;
}

const postReply = async (organizationId: string, 
                         projectId: number, 
                         replyMessage: string, 
                         threadId: number,
                         anonymous: string) => {
    const data = {
        replyMessage: replyMessage,
        anonymous: anonymous
    };

    const apiService = createAxiosInstance();
    const baseReplyUrl = await getBaseReplyUrl(organizationId, projectId, threadId);
    const response = await apiService.post(baseReplyUrl, data);

    return response;
}

const updateReply = async (organizationId: string, 
                           projectId: number, 
                           replyId: number, 
                           threadMessage: string) => {
    const data = {
        message: threadMessage
    };

    const apiService = createAxiosInstance();
    const baseReplyUrl = await getBaseReplyUrl(organizationId, projectId);
    const response = await apiService.put(`${baseReplyUrl}/${replyId}`, data);

    return response;
}

const deleteReply = async (organizationId: string, projectId: number, replyId: number) => {
    const apiService = createAxiosInstance();
    const baseReplyUrl = await getBaseReplyUrl(organizationId, projectId);
    const response = await apiService.delete(`${baseReplyUrl}/${replyId}`);

    return response;
}

export default {
    getReplies,
    postReply,
    updateReply,
    deleteReply
}