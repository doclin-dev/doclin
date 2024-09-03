import { writable } from 'svelte/store';
import type { ProjectDTO } from '../../../../shared/types/ProjectDTO';
import { apiService } from '$lib/apiService';

export const project = writable<ProjectDTO | undefined>();

export const fetchProject = async (projectId: number, organizationId: string) => {
  const response = await apiService.project.getProject(projectId, organizationId);
  const projectDTO: ProjectDTO = response.data;
  project.set(projectDTO);
};
