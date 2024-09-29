import type { UserDTO } from '$shared/types/UserDTO';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { apiService } from '$lib/apiService';
import { LAST_VISITED_ORGANIZATION_ID, LAST_VISITED_PROJECT_ID } from '$lib/localStorageKeys';
import type { ProjectDTO } from '$shared/types/ProjectDTO';

export const load: PageLoad = async ({ parent }) => {
  const layoutData = await parent();
  const userDTO: UserDTO | undefined = layoutData.user;

  if (userDTO) {
    const organizationId: string | null = getLastVisitedOrganizationId(userDTO);

    if (organizationId == null) {
      redirect(300, '/organization/create');
    }

    const projectId: string | null = await getLastVisitedProjectId(organizationId);

    if (!projectId) {
      redirect(300, `/organization/${organizationId}/project/create`);
    }

    redirect(300, `/organization/${organizationId}/project/${projectId}`);
  } else {
    redirect(300, '/login');
  }
};

const getLastVisitedOrganizationId = (userDTO: UserDTO) => {
  const lastVisitedOrganizationId: string | null = localStorage.getItem(LAST_VISITED_ORGANIZATION_ID);
  const organizationIds = userDTO.organizations.map((organization) => organization.id);

  if (lastVisitedOrganizationId && organizationIds.includes(lastVisitedOrganizationId)) {
    return lastVisitedOrganizationId;
  }

  if (organizationIds.length > 0) {
    return organizationIds[0];
  }

  return null;
};

const getLastVisitedProjectId = async (organizationId: string) => {
  const lastVisitedProjectId: string | null = localStorage.getItem(LAST_VISITED_PROJECT_ID);
  const organizationPayload = await apiService.organization.getOrganizationWithProperties(organizationId);
  const projects: ProjectDTO[] = organizationPayload.data.projects;
  const projectIds: string[] = projects.map((project) => project.id.toString());

  if (lastVisitedProjectId && projectIds.includes(lastVisitedProjectId)) {
    return lastVisitedProjectId;
  }

  if (projectIds.length > 0) {
    return projectIds[0];
  }

  return null;
};
