import type { UserDTO } from '../../../shared/types/UserDTO';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { apiService } from '$lib/apiService';
import { LAST_VISITED_ORGANIZATION_ID, LAST_VISITED_PROJECT_ID } from '$lib/localStorageKeys';

export const load: PageLoad = async ({ parent }) => {
  const layoutData = await parent();
  const userDTO: UserDTO = layoutData.user;

  if (userDTO) {
    let organizationId: string | null = localStorage.getItem(LAST_VISITED_ORGANIZATION_ID);
    let projectId: string | null = localStorage.getItem(LAST_VISITED_PROJECT_ID);

    if (!organizationId || !projectId) {
      if (userDTO.organizations.length === 0) {
        redirect(300, '/organization/create');
      }

      organizationId = userDTO.organizations[0].id;
      const organizationPayload = await apiService.organization.getOrganizationWithProperties(organizationId);
      const projects = organizationPayload.data.projects;

      if (projects.length === 0) {
        redirect(300, `/organization/${organizationId}/project/create`);
      }

      projectId = projects[0].id.toString();
      redirect(300, `/organization/${organizationId}/project/${projectId}`);
    }

    redirect(300, `/organization/${organizationId}/project/${projectId}`);
  } else {
    redirect(300, '/login');
  }
};
