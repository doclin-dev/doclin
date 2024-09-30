import { OrganizationDTO } from './OrganizationDTO';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  organizations: OrganizationDTO[];
}
