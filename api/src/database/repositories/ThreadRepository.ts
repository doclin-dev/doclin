import { Thread } from '../entities/Thread';
import { AppDataSource } from '../dataSource';
import { Brackets } from 'typeorm/query-builder/Brackets';

export const ThreadRepository = AppDataSource.getRepository(Thread).extend({
  async findThreadByFilePathAndProjectId(filePath: string, projectId: number): Promise<Thread[]> {
    const relevantThreads = await this.createQueryBuilder('thread')
      .leftJoin('thread.snippets', 'snippet')
      .where((queryBuilder) => {
        queryBuilder
          .where('thread.filePath = :filePath', { filePath })
          .orWhere('snippet.filePath = :filePath', { filePath });
      })
      .andWhere('thread.projectId = :projectId', { projectId })
      .getMany();

    if (relevantThreads.length === 0) {
      return relevantThreads;
    }

    const threadIds = relevantThreads.map((thread) => thread.id);

    const relevantThreadsWithAllInfoPopulated = this.createQueryBuilder('thread')
      .leftJoinAndSelect('thread.snippets', 'snippet')
      .leftJoinAndSelect('thread.user', 'user')
      .leftJoinAndSelect('thread.replies', 'reply')
      .where('thread.projectId = :projectId', { projectId })
      .andWhere('thread.id IN (:...threadIds)', { threadIds })
      .orderBy('COALESCE(reply.createdAt, thread.createdAt)', 'DESC')
      .loadRelationCountAndMap('thread.replyCount', 'thread.replies')
      .getMany();

    return relevantThreadsWithAllInfoPopulated;
  },

  async findAllThreadsByProjectId(projectId: number): Promise<Thread[]> {
    return this.createQueryBuilder('thread')
      .leftJoinAndSelect('thread.snippets', 'snippet')
      .leftJoinAndSelect('thread.user', 'user')
      .leftJoinAndSelect('thread.replies', 'reply')
      .where('thread.projectId = :projectId', { projectId })
      .orderBy('COALESCE(reply.createdAt, thread.createdAt)', 'DESC')
      .loadRelationCountAndMap('thread.replyCount', 'thread.replies')
      .getMany();
  },

  findThreadWithPropertiesByThreadId(threadId: number): Promise<Thread | null> {
    return this.createQueryBuilder('thread')
      .leftJoinAndSelect('thread.snippets', 'snippet')
      .leftJoinAndSelect('thread.user', 'user')
      .leftJoinAndSelect('thread.replies', 'reply')
      .andWhere('thread.id = :threadId', { threadId })
      .loadRelationCountAndMap('thread.replyCount', 'thread.replies')
      .getOne();
  },

  findThreadById(threadId: number): Promise<Thread | null> {
    return this.findOneBy({ id: threadId });
  },

  async findUsersByThreadId(threadId: number) {
    const threadWithUsers = await this.createQueryBuilder('thread')
      .leftJoinAndSelect('thread.user', 'user')
      .leftJoinAndSelect('thread.replies', 'reply')
      .leftJoinAndSelect('reply.user', 'replyUser')
      .andWhere('thread.id = :threadId', { threadId })
      .getOne();

    if (!threadWithUsers) {
      return [];
    }

    const users = [threadWithUsers.user, ...threadWithUsers.replies.map((reply) => reply.user)];

    return users;
  },

  async searchThreads(searchText: string, projectId: number): Promise<Thread[]> {
    const formattedSearchText = searchText.split(' ').join('&');
    console.log('f',formattedSearchText);

    return this.createQueryBuilder('thread')
      .leftJoinAndSelect('thread.snippets', 'snippet')
      .leftJoinAndSelect('thread.user', 'user')
      .leftJoinAndSelect('thread.replies', 'reply')
      .where(`thread.projectId = :projectId`, { projectId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`to_tsvector('english', thread.title) @@ to_tsquery('english', :formattedSearchText)`, {
            formattedSearchText,
          })
            .orWhere(`to_tsvector('english', thread.message) @@ to_tsquery('english', :formattedSearchText)`, {
              formattedSearchText,
            })
            .orWhere(`to_tsvector('english', reply.message) @@ to_tsquery('english', :formattedSearchText)`, {
              formattedSearchText,
            })
            .orWhere(`to_tsvector('english', snippet.text) @@ to_tsquery('english', :formattedSearchText)`, {
              formattedSearchText,
            });
        })
      )
      .orderBy(`ts_rank(to_tsvector('english', thread.title), to_tsquery('english', :formattedSearchText))`, 'DESC')
      .addOrderBy(
        `ts_rank(to_tsvector('english', thread.message), to_tsquery('english', :formattedSearchText))`,
        'DESC'
      )
      .addOrderBy(`ts_rank(to_tsvector('english', reply.message), to_tsquery('english', :formattedSearchText))`, 'DESC')
      .addOrderBy(`ts_rank(to_tsvector('english', snippet.text), to_tsquery('english', :formattedSearchText))`, 'DESC')
      .loadRelationCountAndMap('thread.replyCount', 'thread.replies')
      .getMany();
  },
});
