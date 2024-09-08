import { apiService } from '$lib/apiService';
import type { ProjectDTO } from '../../../../../../../shared/types/ProjectDTO';
import type { ThreadResponseDTO } from '../../../../../../../shared/types/ThreadResponseDTO';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const organizationId = params.organizationId;
  const projectId = parseInt(params.projectId);
  const projectResponse = await apiService.project.getProject(projectId, organizationId);
  const projectDTO: ProjectDTO = projectResponse.data;

  const threadResponse = await apiService.thread.getAllThreads(organizationId, projectId);
  const threadDTOs: ThreadResponseDTO[] = threadResponse.data;

  return {
    organizationId: organizationId,
    project: projectDTO,
    threads: threadDTOs,
  };
};
