import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '../$types';
import type { UserDTO } from '$shared/types/UserDTO';

export const load: PageLoad = async ({ parent }) => {
  const layoutData = await parent();
  const userDTO: UserDTO | undefined = layoutData.user;

  if (userDTO) {
    redirect(300, '/');
  }
};
