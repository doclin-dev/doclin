import { fetchOrganization } from '$lib/stores/organization';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ params }) => {
  const organizationId = params.organizationId;
  await fetchOrganization(organizationId);
};
