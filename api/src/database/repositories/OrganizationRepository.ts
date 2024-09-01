import { AppDataSource } from '../dataSource';
import { Organization } from '../entities/Organization';
import { User } from '../entities/User';

export const OrganizationRepository = AppDataSource.getRepository(Organization).extend({
  findOrganizationById(id: string) {
    return this.findOneByOrFail({ id: id });
  },

  findOrganizationsByUserId(userId: number) {
    return this.createQueryBuilder('organization')
      .leftJoin('organization.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  },

  checkUserExistsInOrganization(organizationId: string, userId: number) {
    return this.createQueryBuilder('organization')
      .leftJoin('organization.users', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('organization.id = :organizationId', { organizationId })
      .getExists();
  },

  addAuthorizedUser(organization: Organization, user: User) {
    return this.createQueryBuilder().relation(Organization, 'users').of(organization).add(user);
  },
});
