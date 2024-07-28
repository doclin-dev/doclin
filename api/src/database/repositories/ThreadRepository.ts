import { Thread } from '../entities/Thread';
import { AppDataSource } from '../dataSource';
import { createEmbedding } from '../../utils/embedding';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { getThreadMessageWithSnippet } from '../../utils/snippetUtils';

export const ThreadRepository = AppDataSource.getRepository(Thread).extend({
  async findThreadByFilePathAndProjectId(filePath: string, projectId: number): Promise<Thread[]> {
    const relevantThreads = await this.createQueryBuilder('thread')
      .leftJoin('thread.snippets', 'snippet')
      .where(
        new Brackets((queryBuilder) => {
          queryBuilder
            .where('thread.filePath = :filePath', { filePath })
            .orWhere('snippet.filePath = :filePath', { filePath });
        })
      )
      .andWhere('thread.projectId = :projectId', { projectId })
      .getMany();

    if (relevantThreads.length === 0) {
      return relevantThreads;
    }

    const threadIds = relevantThreads.map((thread) => thread.id);
    const relevantThreadsWithAllInfoPopulated = await this.getThreadsWithProperties()
      .where('thread.projectId = :projectId', { projectId })
      .andWhereInIds(threadIds)
      .orderBy('COALESCE(reply.createdAt, thread.createdAt)', 'DESC')
      .loadRelationCountAndMap('thread.replyCount', 'thread.replies')
      .getMany();

    return relevantThreadsWithAllInfoPopulated;
  },

  async findAllThreadsByProjectId(projectId: number): Promise<Thread[]> {
    return await this.createQueryBuilder('thread')
      .leftJoinAndSelect('thread.snippets', 'threadSnippet')
      .leftJoinAndSelect('thread.user', 'user')
      .leftJoinAndSelect('thread.replies', 'reply')
      .leftJoinAndSelect('reply.snippets', 'replySnippet')
      .where('thread.projectId = :projectId', { projectId })
      .orderBy('COALESCE(reply.createdAt, thread.createdAt)', 'DESC')
      .loadRelationCountAndMap('thread.replyCount', 'thread.replies')
      .getMany();
  },

  async findThreadWithPropertiesByThreadId(threadId: number): Promise<Thread | null> {
    return await this.createQueryBuilder('thread')
      .leftJoinAndSelect('thread.snippets', 'snippet')
      .leftJoinAndSelect('thread.user', 'user')
      .leftJoinAndSelect('thread.replies', 'reply')
      .andWhere('thread.id = :threadId', { threadId })
      .loadRelationCountAndMap('thread.replyCount', 'thread.replies')
      .getOne();
  },

  async findThreadById(threadId: number): Promise<Thread | null> {
    return await this.findOneBy({ id: threadId });
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

  async searchThreads(searchText: string, projectId: number, limit: number = 10): Promise<Thread[]> {
    const targetVector: number[] = await createEmbedding(searchText);
    const targetVectorString = targetVector.join(',');

    const threads = await this.createQueryBuilder('thread')
      .addSelect(`embedding::vector <-> ARRAY[${targetVectorString}]::vector`, 'similarity')
      .where('thread.projectId = :projectId', { projectId })
      .orderBy('similarity', 'ASC')
      .limit(limit)
      .getMany();

    const threadIds = threads.map((thread) => thread.id);
    const threadOrder = threadIds.join(',');

    return await this.getThreadsWithProperties()
      .where('thread.projectId = :projectId', { projectId })
      .andWhereInIds(threadIds)
      .orderBy(`ARRAY_POSITION(ARRAY[${threadOrder}], thread.id)`)
      .getMany();
  },

  getThreadsWithProperties(): SelectQueryBuilder<Thread> {
    return this.createQueryBuilder('thread')
      .leftJoinAndSelect('thread.snippets', 'threadSnippets')
      .leftJoinAndSelect('thread.user', 'user')
      .leftJoinAndSelect('thread.replies', 'reply')
      .leftJoinAndSelect('reply.snippets', 'replySnippets');
  },

  async updateEmbeddingsOfAllThreads(projectId: number): Promise<void> {
    const threads = await this.findAllThreadsByProjectId(projectId);
    const updatePromises = threads.map((thread) => this.updateSearchEmbeddingsForThread(thread));
    await Promise.all(updatePromises);
  },

  async updateSearchEmbeddingsForThread(thread: Thread) {
    let searchText = ``;
    searchText += thread.title ?? '';
    searchText += getThreadMessageWithSnippet(thread) ?? '';
    searchText += thread.user.name ?? '';

    thread.replies.forEach((reply) => {
      searchText += getThreadMessageWithSnippet(reply) ?? '';
    });

    thread.embedding = await createEmbedding(searchText);
    thread.save();
  },
});
