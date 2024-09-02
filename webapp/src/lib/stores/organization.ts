import { writable } from 'svelte/store';
import type { OrganizationDTO } from '../../../../shared/types/OrganizationDTO';
import { apiService } from '$lib/apiService';

export const organization = writable<OrganizationDTO>();

export const fetchOrganization = async (organizationId: string, request: Request) => {
  apiService.readTokenFromRequest(request);
  const response = await apiService.organization.getOrganization(organizationId);
  const organizationDTO: OrganizationDTO = response.data;
  organization.set(organizationDTO);
};
