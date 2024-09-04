import { apiService } from '$lib/apiService';
import type { ProjectDTO } from '../../../../../../../shared/types/ProjectDTO';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const organizationId = params.organizationId;
  const projectId = parseInt(params.projectId);
  const response = await apiService.project.getProject(projectId, organizationId);
  const projectDTO: ProjectDTO = response.data;

  return { project: projectDTO };
};
