import { readDoclinFile } from './doclinFile/readDoclinFile';
import { writeDoclinFile } from './doclinFile/writeDoclinFile';
import logger from '../utils/logger';
import { DoclinFile } from '../types';
import OrganizationCacheManager from '../utils/cache/OrganizationCacheManager';
import { OrganizationDTO } from '$shared/types/OrganizationDTO';
import { apiService } from '../apiService';
import { UserDTO } from '$shared/types/UserDTO';

const UNAUTHORIZED = {
  unauthorized: true,
};

export const getExistingOrganizations = async () => {
  const response = await apiService.organization.getOrganizations();
  const organizations: OrganizationDTO[] = response?.data;
  return organizations;
};

export const postOrganization = async ({ name }: { name: string }) => {
  try {
    const response = await apiService.organization.postOrganization(name);
    const organization: OrganizationDTO = response?.data;

    const organizationCacheManager = new OrganizationCacheManager();
    await organizationCacheManager.set(organization.id, organization);

    await storeOrganizationId(organization.id);

    return organization;
  } catch (error: any) {
    logger.error(`Error posting organization ${error}`, true);
  }
};

export const getCurrentOrganizationId = async (): Promise<string | null> => {
  const fileJSON: DoclinFile = await readDoclinFile();

  return fileJSON?.organizationId;
};

export const getOrganization = async (organizationId: string): Promise<OrganizationDTO | { unauthorized: boolean }> => {
  const organizationCacheManager = new OrganizationCacheManager();
  const cachedOrganization = await organizationCacheManager.get(organizationId);

  if (cachedOrganization) {
    return cachedOrganization;
  }

  return apiFetchOrganization(organizationId);
};

const apiFetchOrganization = async (organizationId: string) => {
  try {
    const response = await apiService.organization.getOrganizationWithProperties(organizationId);
    const organization: OrganizationDTO = response?.data;

    const organizationCacheManager = new OrganizationCacheManager();
    await organizationCacheManager.set(organization.id, organization);

    return organization;
  } catch {
    return UNAUTHORIZED;
  }
};

export const storeOrganizationId = async (organizationId: string) => {
  try {
    const fileJSON: DoclinFile = await readDoclinFile();

    if (fileJSON) {
      fileJSON['organizationId'] = organizationId;

      await writeDoclinFile(fileJSON);
    }
  } catch (error: any) {
    logger.error(`An error occurred: ${error.message}`);
  }
};

export const getCurrentOrganizationUsers = async (): Promise<UserDTO[]> => {
  const organizationId = await getCurrentOrganizationId();

  if (!organizationId) {
    return [];
  }

  const response = await apiService.organization.getOrganizationWithProperties(organizationId);
  const organization: OrganizationDTO = response?.data;
  const members: UserDTO[] = organization.members;

  return members;
};
