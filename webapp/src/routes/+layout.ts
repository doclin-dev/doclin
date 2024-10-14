import { fetchUser } from '$lib/stores/user';
import type { UserDTO } from '$shared/types/UserDTO';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async () => {
  try {
    const user: UserDTO | undefined = await fetchUser();

    return {
      user: user,
    };
  } catch (err) {
    console.error(err);
    return {
      error: {
        message: 'An error occurred',
      },
    };
  }
};
