import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const organizationId = params.organizationId;

  return {
    organizationId,
  };
};
