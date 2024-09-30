import { apiService } from '$lib/apiService';
import type { OrganizationDTO } from '$shared/types/OrganizationDTO';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ params }) => {
  const organizationId = params.organizationId;
  const response = await apiService.organization.getOrganizationWithProperties(organizationId);
  const organizationDTO: OrganizationDTO = response.data;

  return {
    organization: organizationDTO,
  };
};
