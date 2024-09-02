import { Organization } from '../database/entities/Organization';
import { OrganizationDTO } from '../../../shared/types/OrganizationDTO';
import { mapUserToUserDTO } from './userToUserDTOMapper';

export const mapOrganizationToOrganizationDTO = (organization: Organization): OrganizationDTO => {
  return {
    id: organization.id,
    name: organization.name,
    members: organization.users?.map(mapUserToUserDTO),
  };
};
