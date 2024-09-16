import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { organization } = await parent();

  return {
    organization: organization,
  };
};
