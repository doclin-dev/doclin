import { EntityRepository, Repository } from "typeorm";
import { Thread } from "../entities/Thread";

@EntityRepository(Thread)
export class ThreadRepository extends Repository<Thread> {
    findThreadByFilePathAndProjectId(filePath: string, projectId: number) {
        return this.createQueryBuilder('thread')
                    .leftJoinAndSelect('thread.snippets', 'snippet')
                    .leftJoinAndSelect('snippet.snippetFilePaths', 'snippetFilePath')
                    .leftJoinAndSelect('thread.user', 'user')
                    .where('snippetFilePath.filePath = :filePath', { filePath })
                    .andWhere('thread.projectId = :projectId', { projectId })
                    .orderBy('thread.id', 'DESC')
                    .getMany();
    }

    findThreadByThreadId(threadId: number) {
        return this.createQueryBuilder('thread')
                    .leftJoinAndSelect('thread.snippets', 'snippet')
                    .leftJoinAndSelect('snippet.snippetFilePaths', 'snippetFilePath')
                    .leftJoinAndSelect('thread.user', 'user')
                    .andWhere('thread.id = :threadId', { threadId })
                    .getOneOrFail();
    }
}