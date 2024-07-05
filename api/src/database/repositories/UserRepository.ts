import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

export const UserRepository = AppDataSource.getRepository(User).extend({
  findUserById(id: number) {
    return this.findOneBy({ id });
  },

  findUsersByOrganizationId(organizationId: string) {
    return this.createQueryBuilder('user')
      .leftJoin('user.organizations', 'organization')
      .where('organization.id = :organizationId', { organizationId })
      .getMany();
  },
});
