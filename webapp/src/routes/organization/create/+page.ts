import { goto } from '$app/navigation';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { user } = await parent();

  if (!user) {
    goto('/login');
  }
};
