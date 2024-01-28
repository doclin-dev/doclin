import { AppDataSource } from "../dataSource";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User).extend({
    findUserById(id: number) {
        return this.findOneBy({ id });
    },

    findUsersByOrganizationId(organizationId: string) {
        return  this.createQueryBuilder('user')
                    .leftJoin('user.organizations', 'organization')
                    .where('organization.id = :organizationId', { organizationId })
                    .getMany();
    },

    findUserByGithubId(githubId: string) {
        return this.findOneBy({ githubId: githubId });
    },

    findUsersByProjectId(organizationId:string, projectId: number) {
        return  this.createQueryBuilder('user')
                    .leftJoin('user.organizations', 'organization')
                    .where('organization.id = :organizationId', { organizationId })
                    .andWhere('thread.projectId = :projectId', { projectId })
                    .getMany();
    }

    // findUsersByUserIds(userIds: User[]){
    //     return  this.createQueryBuilder('user')
    //                 .leftJoin('user.organizations', 'organization')
    //                 .where('user.id = :organizationId', { organizationId })
    //                 .getMany();
    // }
});
