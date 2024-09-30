import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

export const UserRepository = AppDataSource.getRepository(User).extend({
  findUserById(userId: number): Promise<User> {
    return this.findOneByOrFail({ id: userId });
  },

  findUsersByIds(userIds: number[]): Promise<User[]> {
    return this.createQueryBuilder('user').whereInIds(userIds).getMany();
  },

  findUsersByOrganizationId(organizationId: string): Promise<User[]> {
    return this.createQueryBuilder('user')
      .leftJoin('user.organizations', 'organization')
      .where('organization.id = :organizationId', { organizationId })
      .getMany();
  },

  findUserWithPropertiesById(userId: number): Promise<User> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.organizations', 'organization')
      .where('user.id = :userId', { userId })
      .getOneOrFail();
  },
});
