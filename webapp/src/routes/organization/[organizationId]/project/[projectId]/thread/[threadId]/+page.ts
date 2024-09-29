import { apiService } from '$lib/apiService';
import { LAST_VISITED_ORGANIZATION_ID, LAST_VISITED_PROJECT_ID } from '$lib/localStorageKeys';
import type { ThreadResponseDTO } from '$shared/types/ThreadResponseDTO';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const organizationId = params.organizationId;
  const projectId = parseInt(params.projectId);
  const threadId = parseInt(params.threadId);

  const threadResponse = await apiService.thread.getThread(threadId, projectId, organizationId);
  const threadDTO: ThreadResponseDTO = threadResponse.data;

  localStorage.setItem(LAST_VISITED_ORGANIZATION_ID, organizationId);
  localStorage.setItem(LAST_VISITED_PROJECT_ID, projectId.toString());

  return {
    thread: threadDTO,
    organizationId: organizationId,
    projectId: projectId,
  };
};
