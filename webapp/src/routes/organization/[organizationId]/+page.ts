import { fetchOrganization } from '$lib/stores/organization';
import type { PageServerLoad } from '../../$types';

export const load: PageServerLoad = async ({ request, params }) => {
  const { organizationId } = params;
  await fetchOrganization(organizationId, request);
};
