import { writable } from 'svelte/store';
import type { UserDTO } from '../../../../shared/types/UserDTO';
import { apiService } from '$lib/apiService';

export const user = writable<UserDTO | undefined>();

export const fetchUser = async (): Promise<void> => {
  const response = await apiService.auth.getAuthenticatedUser();
  const userDTO: UserDTO = response.data;
  user.set(userDTO);
};
