import { apiService } from '$lib/apiService';
import { LAST_VISITED_ORGANIZATION_ID, LAST_VISITED_PROJECT_ID } from '$lib/localStorageKeys';
import type { ProjectDTO } from '$shared/types/ProjectDTO';
import type { ThreadResponseDTO } from '$shared/types/ThreadResponseDTO';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { ApiError } from '$shared/types/ApiError';
import { goto } from '$app/navigation';

export const load: PageLoad = async ({ params, url }) => {
  const organizationId: string = params.organizationId;
  const projectId: number = parseInt(params.projectId);
  const searchQuery: string | null = url.searchParams.get('search');

  try {
    const projectResponse = await apiService.project.getProject(projectId, organizationId);
    const projectDTO: ProjectDTO = projectResponse.data;

    localStorage.setItem(LAST_VISITED_ORGANIZATION_ID, organizationId);
    localStorage.setItem(LAST_VISITED_PROJECT_ID, projectId.toString());

    return {
      organizationId: organizationId,
      project: projectDTO,
      threads: await fetchThreads(organizationId, projectId, searchQuery),
      searchQuery: searchQuery,
    };
  } catch (err: unknown) {
    const apiError = err as ApiError;
    if (apiError.status === 401) {
      goto('/login');
    }
    if (apiError.status === 403) {
      error(403, 'You do not have the permission to access this project.');
    }
    throw err;
  }
};

const fetchThreads = async (
  organizationId: string,
  projectId: number,
  searchQuery: string | null
): Promise<ThreadResponseDTO[]> => {
  if (searchQuery) {
    const threadResponse = await apiService.thread.searchThreads(searchQuery, projectId, organizationId);
    return threadResponse.data;
  } else {
    const threadResponse = await apiService.thread.getAllThreads(organizationId, projectId);
    return threadResponse.data;
  }
};
