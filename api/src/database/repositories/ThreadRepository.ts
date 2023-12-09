import { Thread } from "../entities/Thread";
import { AppDataSource } from "../dataSource";

export const ThreadRepository = AppDataSource.getRepository(Thread).extend({
    async findThreadByFilePathAndProjectId(filePath: string, projectId: number) {
        const relevantThreads = await this.createQueryBuilder('thread')
                                            .leftJoin('thread.snippets', 'snippet')
                                            .leftJoin('snippet.snippetFilePaths', 'snippetFilePath')
                                            .where('snippetFilePath.filePath = :filePath', { filePath })
                                            .andWhere('thread.projectId = :projectId', { projectId })
                                            .getMany();

        if (relevantThreads.length == 0) {
            return relevantThreads;
        }
                                            
        const threadIds = relevantThreads.map(thread => (thread.id));

        const relevantThreadsWithAllInfoPopulated =  this.createQueryBuilder('thread')
                                                            .leftJoinAndSelect('thread.snippets', 'snippet')
                                                            .leftJoinAndSelect('snippet.snippetFilePaths', 'snippetFilePath')
                                                            .leftJoinAndSelect('thread.user', 'user')
                                                            .addSelect('(SELECT COUNT(r.id) FROM reply r WHERE r."threadId" = thread.id)', 'replyCount')
                                                            .where('thread.projectId = :projectId', { projectId })
                                                            .andWhere("thread.id IN (:...threadIds)", { threadIds })
                                                            .orderBy('thread.id', 'DESC')
                                                            .getMany();
        return relevantThreadsWithAllInfoPopulated;
    },

    async findAllThreadsByProjectId(projectId: number) {
        const relevantThreads = await this.createQueryBuilder('thread')
                                            .leftJoin('thread.snippets', 'snippet')
                                            .leftJoin('snippet.snippetFilePaths', 'snippetFilePath')
                                            .where('thread.projectId = :projectId', { projectId })
                                            .getMany();

        if (relevantThreads.length == 0) {
            return relevantThreads;
        }
                                            
        const threadIds = relevantThreads.map(thread => (thread.id));

        const relevantThreadsWithAllInfoPopulated =  this.createQueryBuilder('thread')
                                                            .leftJoinAndSelect('thread.snippets', 'snippet')
                                                            .leftJoinAndSelect('snippet.snippetFilePaths', 'snippetFilePath')
                                                            .leftJoinAndSelect('thread.user', 'user')
                                                            .addSelect('(SELECT COUNT(r.id) FROM reply r WHERE r."threadId" = thread.id)', 'replyCount')
                                                            .where('thread.projectId = :projectId', { projectId })
                                                            .andWhere("thread.id IN (:...threadIds)", { threadIds })
                                                            .orderBy('thread.id', 'DESC')
                                                            .getMany();
        
        return relevantThreadsWithAllInfoPopulated;
    },

    findThreadWithPropertiesByThreadId(threadId: number) {
        return this.createQueryBuilder('thread')
                    .leftJoinAndSelect('thread.snippets', 'snippet')
                    .leftJoinAndSelect('snippet.snippetFilePaths', 'snippetFilePath')
                    .leftJoinAndSelect('thread.user', 'user')
                    .andWhere('thread.id = :threadId', { threadId })
                    .getOneOrFail();
    },

    findThreadById(threadId: number) {
        return this.findOneBy({ id: threadId });
    }
});