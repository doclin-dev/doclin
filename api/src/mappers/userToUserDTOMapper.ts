import { User } from '../database/entities/User';
import { UserDTO } from '../../../shared/types/UserDTO';
import { mapOrganizationToOrganizationDTO } from './organizationToOrganizationDTOMapper';

export const mapUserToUserDTO = (user: User): UserDTO => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    organizations: user.organizations?.map(mapOrganizationToOrganizationDTO) ?? [],
  };
};
