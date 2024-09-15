import { writable } from 'svelte/store';
import type { UserDTO } from '../../../../shared/types/UserDTO';
import { apiService } from '$lib/apiService';

export const user = writable<UserDTO>();

export const fetchUser = async (): Promise<UserDTO> => {
  const response = await apiService.auth.getAuthenticatedUserWithProperties();
  const userDTO: UserDTO = response.data;
  user.set(userDTO);
  return userDTO;
};
