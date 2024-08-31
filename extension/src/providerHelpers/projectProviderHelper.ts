import projectApi from '../api/projectApi';
import { getCurrentOrganizationId } from './organizationProviderHelper';
import { readDoclinFile } from './doclinFile/readDoclinFile';
import { writeDoclinFile } from './doclinFile/writeDoclinFile';
import logger from '../utils/logger';
import { DoclinFile } from '../types';
import ProjectCacheMananger from '../utils/cache/ProjectCacheManager';
import { ProjectDTO } from '../../../shared/types/ProjectDTO';

const UNAUTHORIZED = {
  unauthorized: true,
};

export const getCurrentProjectId = async (): Promise<number | null> => {
  const fileJSON: DoclinFile = await readDoclinFile();

  return fileJSON?.projectId;
};

export const getProject = async (
  organizationId: string,
  projectId: number
): Promise<ProjectDTO | { unauthorized: boolean }> => {
  const projectCacheManager = new ProjectCacheMananger();
  const cachedProject = await projectCacheManager.get(projectId);

  if (cachedProject) {
    return cachedProject;
  }

  return apiFetchProject(organizationId, projectId);
};

const apiFetchProject = async (
  organizationId: string,
  projectId: number
): Promise<ProjectDTO | { unauthorized: boolean }> => {
  try {
    const response = await projectApi.getProject(projectId, organizationId);
    const payload = response?.data;
    const project = payload?.project;

    const projectCacheManager = new ProjectCacheMananger();
    await projectCacheManager.set(project.id, project);

    return project;
  } catch (error) {
    return UNAUTHORIZED;
  }
};

export const getExistingProjects = async () => {
  const organizationId = await getCurrentOrganizationId();

  if (!organizationId) {
    return { projects: null };
  }

  const response = await projectApi.getProjects(organizationId);
  const payload = response?.data;
  const projects = payload?.projects;

  return projects;
};

export const postProject = async ({ name, privateProject }: { name: string; privateProject: boolean }) => {
  const organizationId = await getCurrentOrganizationId();

  if (!organizationId) {
    return { project: null };
  }

  const response = await projectApi.postProject(organizationId, name, privateProject);
  const payload = response?.data;
  const project = payload?.project;

  const projectCacheManager = new ProjectCacheMananger();
  await projectCacheManager.set(project.id, project);

  await storeProjectId(project.id);

  return project;
};

export const storeProjectId = async (projectId: number) => {
  try {
    const fileJSON: DoclinFile = await readDoclinFile();

    if (fileJSON) {
      fileJSON['projectId'] = projectId;

      await writeDoclinFile(fileJSON);
    }
  } catch (error: any) {
    logger.error(`An error occurred: ${error}`, true);
  }
};
