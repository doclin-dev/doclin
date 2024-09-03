import { writable } from 'svelte/store';
import type { OrganizationDTO } from '../../../../shared/types/OrganizationDTO';
import { apiService } from '$lib/apiService';

export const organization = writable<OrganizationDTO>();

export const fetchOrganization = async (organizationId: string) => {
  const response = await apiService.organization.getOrganizationWithProperties(organizationId);
  const organizationDTO: OrganizationDTO = response.data;
  console.log(organizationDTO);
  organization.set(organizationDTO);
};
