import { AppDataSource } from "../dataSource";
import { Organization } from "../entities/Organization";

export const OrganizationRepository = AppDataSource.getRepository(Organization).extend({
    findOrganizationById(id: string) {
        return this.findOneBy({ id: id });
    },

    findOrganizationsByUserId(userId: number) {
        return  this.createQueryBuilder('organization')
                    .leftJoin('organization.users', 'user')
                    .where('user.id = :userId', { userId })
                    .getMany();
    },

    checkUserExistsInOrganization(organizationId: string, userId: number) {
        return  this.createQueryBuilder('organization')
                    .leftJoin('organization.users', 'user')
                    .where('user.id = :userId', { userId })
                    .andWhere('organization.id = :organizationId', { organizationId })
                    .getExists();
    }
});
