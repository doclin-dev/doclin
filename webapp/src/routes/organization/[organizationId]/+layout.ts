import { apiService } from '$lib/apiService';
import { LAST_VISITED_ORGANIZATION_ID } from '$lib/localStorageKeys';
import type { OrganizationDTO } from '../../../../../shared/types/OrganizationDTO';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ params }) => {
  const organizationId = params.organizationId;
  const response = await apiService.organization.getOrganizationWithProperties(organizationId);
  const organizationDTO: OrganizationDTO = response.data;

  localStorage.setItem(LAST_VISITED_ORGANIZATION_ID, organizationId);

  return {
    organization: organizationDTO,
  };
};
