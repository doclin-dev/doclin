import { writable } from 'svelte/store';
import type { OrganizationDTO } from '$shared/types/OrganizationDTO';
import { apiService } from '$lib/apiService';

export const organization = writable<OrganizationDTO | undefined>();

export const fetchOrganization = async (organizationId: string): Promise<OrganizationDTO> => {
  const response = await apiService.organization.getOrganizationWithProperties(organizationId);
  const organizationDTO: OrganizationDTO = response.data;
  organization.set(organizationDTO);
  return organizationDTO;
};
