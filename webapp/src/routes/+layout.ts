import { fetchUser } from '$lib/stores/user';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
  await fetchUser();

  return {};
};
