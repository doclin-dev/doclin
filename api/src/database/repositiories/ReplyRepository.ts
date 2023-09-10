import { AppDataSource } from "../dataSource";
import { Reply } from "../entities/Reply";

export const ReplyRepository = AppDataSource.getRepository(Reply).extend({
    findRepliesByThreadId(threadId: number) {
        return  this.createQueryBuilder('reply')
                    .leftJoinAndSelect('reply.user', 'user')
                    .where('reply.threadId = :threadId', { threadId })
                    .orderBy('reply.id', 'DESC')
                    .getMany();
    },

    findReplyById(replyId: number) {
        return  this.createQueryBuilder('reply')
                    .leftJoinAndSelect('reply.user', 'user')
                    .where('reply.id = :replyId', { replyId })
                    .getOne();
    }
});
