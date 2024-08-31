import { readDoclinFile } from './doclinFile/readDoclinFile';
import { writeDoclinFile } from './doclinFile/writeDoclinFile';
import logger from '../utils/logger';
import { DoclinFile, User } from '../types';
import OrganizationCacheManager from '../utils/cache/OrganizationCacheManager';
import { OrganizationDTO } from '../../../shared/types/OrganizationDTO';
import { apiService } from '../apiService';

const UNAUTHORIZED = {
  unauthorized: true,
};

export const getExistingOrganizations = async () => {
  const response = await apiService.organization.getOrganizations();
  const payload = response?.data;
  const organizations = payload?.organizations;

  return organizations;
};

export const postOrganization = async ({ name }: { name: string }) => {
  try {
    const response = await apiService.organization.postOrganization(name);
    const payload = response?.data;
    const organization: OrganizationDTO = payload?.organization;

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

  try {
    return apiFetchOrganization(organizationId);
  } catch {
    return UNAUTHORIZED;
  }
};

const apiFetchOrganization = async (organizationId: string) => {
  try {
    const response = await apiService.organization.getOrganization(organizationId);
    const payload = response?.data;
    const organization: OrganizationDTO = payload?.organization;

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

export const getCurrentOrganizationUsers = async (): Promise<User | undefined> => {
  const organizationId = await getCurrentOrganizationId();

  if (!organizationId) {
    return;
  }

  const response = await apiService.organization.getOrganizationUsers(organizationId);
  const payload = response?.data;
  const members = payload?.organization?.members;

  return members;
};
