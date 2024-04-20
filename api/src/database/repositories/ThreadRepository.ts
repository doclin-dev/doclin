import { Thread } from "../entities/Thread";
import { AppDataSource } from "../dataSource";
import { Brackets } from "typeorm/query-builder/Brackets";

export const ThreadRepository = AppDataSource.getRepository(Thread).extend({
	
	async findThreadByFilePathAndProjectId(filePath: string, projectId: number): Promise<Thread[]> {
		return this.createQueryBuilder('thread')
			.leftJoinAndSelect('thread.snippets', 'snippet')
			.leftJoinAndSelect('thread.user', 'user')
			.leftJoinAndSelect('thread.replies', 'reply')
			.where('thread.projectId = :projectId AND (thread.filePath = :filePath OR snippet.filePath = :filePath)', { projectId, filePath })
			.orderBy('COALESCE(reply.createdAt, thread.createdAt)', 'DESC')
			.loadRelationCountAndMap("thread.replyCount", "thread.replies")
			.getMany();
	},

	async findAllThreadsByProjectId(projectId: number): Promise<Thread[]> {
		return this.createQueryBuilder('thread')
			.leftJoinAndSelect('thread.snippets', 'snippet')
			.leftJoinAndSelect('thread.user', 'user')
			.leftJoinAndSelect('thread.replies', 'reply')
			.where('thread.projectId = :projectId', { projectId })
			.orderBy('COALESCE(reply.createdAt, thread.createdAt)', 'DESC')
			.loadRelationCountAndMap("thread.replyCount", "thread.replies")
			.getMany();
	},

	findThreadWithPropertiesByThreadId(threadId: number): Promise<Thread | null> {
		return this.createQueryBuilder('thread')
			.leftJoinAndSelect('thread.snippets', 'snippet')
			.leftJoinAndSelect('thread.user', 'user')
			.leftJoinAndSelect('thread.replies', 'reply')
			.andWhere('thread.id = :threadId', { threadId })
			.loadRelationCountAndMap("thread.replyCount", "thread.replies")
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
	
		const users = [threadWithUsers.user, ...threadWithUsers.replies.map(reply => reply.user)];
	
		return users;
	},

	async searchThreads(searchText: string, projectId: number): Promise<Thread[]> {
		const formattedSearchText = searchText.split(' ').join('&');

		return this.createQueryBuilder('thread')
			.leftJoinAndSelect('thread.snippets', 'snippet')
			.leftJoinAndSelect('thread.user', 'user')
			.leftJoinAndSelect('thread.replies', 'reply')
			.where(`thread.projectId = :projectId`, { projectId })
			.andWhere(new Brackets(qb => {
				qb.where(`to_tsvector('english', thread.title) @@ to_tsquery('english', :formattedSearchText)`, { formattedSearchText })
				  .orWhere(`to_tsvector('english', thread.message) @@ to_tsquery('english', :formattedSearchText)`, { formattedSearchText })
				  .orWhere(`to_tsvector('english', reply.message) @@ to_tsquery('english', :formattedSearchText)`, { formattedSearchText });
			}))
			.orderBy(`ts_rank(to_tsvector('english', thread.title), to_tsquery('english', :formattedSearchText))`, 'DESC')
			.addOrderBy(`ts_rank(to_tsvector('english', reply.message), to_tsquery('english', :formattedSearchText))`, 'DESC')
			.loadRelationCountAndMap("thread.replyCount", "thread.replies")
			.getMany();
	}
});