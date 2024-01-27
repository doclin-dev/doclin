import { AppDataSource } from "../dataSource";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User).extend({
    findUserById(id: number) {
        return this.findOneBy({ id: id });
    },

    findUsersByOrganizationId(organizationId: string) {
        return  this.createQueryBuilder('user')
                    .leftJoin('user.organizations', 'organization')
                    .where('organization.id = :organizationId', { organizationId })
                    .getMany();
    },

    findUserByGithubId(githubId: string) {
        return this.findOneBy({ githubId: githubId });
    }
});
