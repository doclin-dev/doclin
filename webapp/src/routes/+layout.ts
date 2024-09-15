import { fetchUser } from '$lib/stores/user';
import type { UserDTO } from '../../../shared/types/UserDTO';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
  const user: UserDTO = await fetchUser();

  return {
    user: user,
  };
};
