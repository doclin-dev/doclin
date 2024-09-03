import { Organization } from '../database/entities/Organization';
import { OrganizationDTO } from '../../../shared/types/OrganizationDTO';
import { mapUserToUserDTO } from './userToUserDTOMapper';
import { mapProjectToProjectDTO } from './projectToProjectDTOMapper';

export const mapOrganizationToOrganizationDTO = (organization: Organization): OrganizationDTO => {
  return {
    id: organization.id,
    name: organization.name,
    members: organization.users?.map(mapUserToUserDTO),
    projects: organization.projects?.map(mapProjectToProjectDTO),
  };
};
