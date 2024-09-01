import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

export const UserRepository = AppDataSource.getRepository(User).extend({
  findUserById(userId: number): Promise<User> {
    return this.findOneByOrFail({ id: userId });
  },

  findUsersByIds(userId: number[]): Promise<User[]> {
    return this.createQueryBuilder('user').whereInIds(userId).getMany();
  },

  findUsersByOrganizationId(organizationId: string): Promise<User[]> {
    return this.createQueryBuilder('user')
      .leftJoin('user.organizations', 'organization')
      .where('organization.id = :organizationId', { organizationId })
      .getMany();
  },
});
