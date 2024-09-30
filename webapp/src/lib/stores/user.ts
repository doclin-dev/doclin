import { writable } from 'svelte/store';
import type { UserDTO } from '$shared/types/UserDTO';
import { apiService } from '$lib/apiService';
import type { ApiError } from '$shared/types/ApiError';

export const user = writable<UserDTO | undefined>();

export const fetchUser = async (): Promise<UserDTO | undefined> => {
  try {
    const response = await apiService.auth.getAuthenticatedUserWithProperties();
    const userDTO: UserDTO = response.data;
    user.set(userDTO);
    return userDTO;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    if (apiError.status === 401) {
      user.set(undefined);
      return;
    }
  }
};
