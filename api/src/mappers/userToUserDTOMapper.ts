import { User } from '../database/entities/User';
import { UserDTO } from '../../../shared/types/UserDTO';

export const mapUserToUserDTO = (user: User): UserDTO => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};
