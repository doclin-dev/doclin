import { Thread } from "../entities/Thread";
import { AppDataSource } from "../dataSource";

export const ThreadRepository = AppDataSource.getRepository(Thread).extend({
	
	async findThreadByFilePathAndProjectId(filePath: string, projectId: number) {
		const relevantThreadsWithAllInfoPopulated =  this.createQueryBuilder('thread')
			.leftJoinAndSelect('thread.snippets', 'snippet')
			.leftJoinAndSelect('thread.user', 'user')
			.leftJoinAndSelect('thread.replies', 'reply')
			.where('thread.projectId = :projectId', { projectId })
			.andWhere(
				queryBuilder => queryBuilder.where('thread.filePath = :filePath', { filePath })
					.orWhere('snippet.filePath = :filePath', { filePath })
			)
			.orderBy('COALESCE(reply.createdAt, thread.createdAt)', 'DESC')
			.loadRelationCountAndMap("thread.replyCount", "thread.replies")
			.getMany();

		return relevantThreadsWithAllInfoPopulated;
	},

	async findAllThreadsByProjectId(projectId: number) {
		return this.createQueryBuilder('thread')
			.leftJoinAndSelect('thread.snippets', 'snippet')
			.leftJoinAndSelect('thread.user', 'user')
			.leftJoinAndSelect('thread.replies', 'reply')
			.where('thread.projectId = :projectId', { projectId })
			.orderBy('COALESCE(reply.createdAt, thread.createdAt)', 'DESC')
			.loadRelationCountAndMap("thread.replyCount", "thread.replies")
			.getMany();
	},

	findThreadWithPropertiesByThreadId(threadId: number) {
		return this.createQueryBuilder('thread')
			.leftJoinAndSelect('thread.snippets', 'snippet')
			.leftJoinAndSelect('thread.user', 'user')
			.leftJoinAndSelect('thread.replies', 'reply')
			.andWhere('thread.id = :threadId', { threadId })
			.loadRelationCountAndMap("thread.replyCount", "thread.replies")
			.getOne();
	},

	findThreadById(threadId: number) {
		return this.findOneBy({ id: threadId });
	}
});