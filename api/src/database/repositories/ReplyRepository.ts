import { AppDataSource } from '../dataSource';
import { Reply } from '../entities/Reply';

export const ReplyRepository = AppDataSource.getRepository(Reply).extend({
  findReplyById(replyId: number): Promise<Reply | null> {
    return this.findOneBy({ id: replyId });
  },

  findRepliesWithPropertiesByThreadId(threadId: number) {
    return this.createQueryBuilder('reply')
      .leftJoinAndSelect('reply.user', 'user')
      .leftJoinAndSelect('reply.snippets', 'snippet')
      .where('reply.threadId = :threadId', { threadId })
      .orderBy('reply.id', 'ASC')
      .getMany();
  },

  findReplyWithPropertiesById(replyId: number) {
    return this.createQueryBuilder('reply')
      .leftJoinAndSelect('reply.user', 'user')
      .leftJoinAndSelect('reply.snippets', 'snippet')
      .where('reply.id = :replyId', { replyId })
      .getOne();
  },
});
