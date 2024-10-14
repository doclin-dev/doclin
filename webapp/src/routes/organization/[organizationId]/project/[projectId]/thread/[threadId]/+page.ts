import { apiService } from '$lib/apiService';
import { LAST_VISITED_ORGANIZATION_ID, LAST_VISITED_PROJECT_ID } from '$lib/localStorageKeys';
import type { ThreadResponseDTO } from '$shared/types/ThreadResponseDTO';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { ApiError } from '$shared/types/ApiError';
import { goto } from '$app/navigation';
import { getDisplayMessage } from '$lib/mappers/threadDisplayMessageMapper';

export const load: PageLoad = async ({ params }) => {
  const organizationId: string = params.organizationId;
  const projectId: number = parseInt(params.projectId);
  const threadId: number = parseInt(params.threadId);

  try {
    const threadResponse = await apiService.thread.getThread(threadId, projectId, organizationId);
    const threadDTO: ThreadResponseDTO = threadResponse.data;
    updateMessageToIncludeSnippet(threadDTO);

    localStorage.setItem(LAST_VISITED_ORGANIZATION_ID, organizationId);
    localStorage.setItem(LAST_VISITED_PROJECT_ID, projectId.toString());

    return {
      thread: threadDTO,
      organizationId: organizationId,
      projectId: projectId,
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

const updateMessageToIncludeSnippet = (threadDTO: ThreadResponseDTO) => {
  threadDTO.message = getDisplayMessage(threadDTO.message, threadDTO.snippets);

  threadDTO.replies.forEach((reply) => {
    reply.message = getDisplayMessage(reply.message, reply.snippets);
  });
};
