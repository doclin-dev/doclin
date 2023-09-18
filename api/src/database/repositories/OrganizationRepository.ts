import { AppDataSource } from "../dataSource";
import { Organization } from "../entities/Organization";

export const OrganizationRepository = AppDataSource.getRepository(Organization).extend({
    findOrganizationById(id: number) {
        return this.findOneBy({ id: id });
    },

    findOrganizationsByUserId(userId: number) {
        return  this.createQueryBuilder('organization')
                    .leftJoin('organization.users', 'user')
                    .where('user.id = :userId', { userId })
                    .getMany();
    }
});
