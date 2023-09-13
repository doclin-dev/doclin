import replyApi from "../api/replyApi";

export const getRepliesByThreadId = async ({ threadId }: { threadId: number }): Promise<any> => {
  const response = await replyApi.getReplies(threadId);
  const payload = response?.data;
  const replies = payload?.replies;

  return replies;
}

export const postReply = async ({ replyMessage, threadId }: {replyMessage: string, threadId: number}): Promise<any> => {
  const response = await replyApi.postReply(replyMessage, threadId);
  const reply = response?.data?.reply;

  return reply;
}

export const updateReply = async ({ replyMessage, replyId }: { replyMessage: string, replyId: number }): Promise<any> => {
  const response = await replyApi.updateReply(replyId, replyMessage);
  const reply = response?.data?.reply;

  return reply;
}

export const deleteReply = async ({ replyId }: { replyId: number }) => {
  const response = await replyApi.deleteReply(replyId);
  const reply = response?.data?.reply;

  return reply;
}