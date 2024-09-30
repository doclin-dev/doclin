import { AppDataSource } from '../dataSource';
import { Organization } from '../entities/Organization';
import { User } from '../entities/User';

export const OrganizationRepository = AppDataSource.getRepository(Organization).extend({
  findOrganizationById(id: string) {
    return this.findOneByOrFail({ id: id });
  },

  findOrganizationWithPublicProjectsById(organizationId: string): Promise<Organization> {
    return this.createQueryBuilder('organization')
      .leftJoinAndSelect('organization.users', 'user')
      .leftJoinAndSelect('organization.projects', 'project', 'project.privateProject = false')
      .where('organization.id = :id', { id: organizationId })
      .getOneOrFail();
  },

  findOrganizationWithAllProjectsById(organizationId: string): Promise<Organization> {
    return this.createQueryBuilder('organization')
      .leftJoinAndSelect('organization.users', 'user')
      .leftJoinAndSelect('organization.projects', 'project')
      .where('organization.id = :id', { id: organizationId })
      .getOneOrFail();
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
