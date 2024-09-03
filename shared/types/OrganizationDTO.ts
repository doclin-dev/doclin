import { ProjectDTO } from './ProjectDTO';
import { UserDTO } from './UserDTO';

export interface OrganizationDTO {
  id: string;
  name: string;
  members: UserDTO[];
  projects: ProjectDTO[];
}
