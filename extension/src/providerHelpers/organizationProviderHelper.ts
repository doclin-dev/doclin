import organizationApi from "../api/organizationApi";
import { readDoclinFile } from "./doclinFile/readDoclinFile";
import { writeDoclinFile } from "./doclinFile/writeDoclinFile";
import logger from "../utils/logger";
import { DoclinFile, Organization, User } from "../types";
import { GlobalStateManager } from "../GlobalStateManager";
import { GlobalStateType } from "../enums";

const UNAUTHORIZED = {
	unauthorized: true
};

export const getExistingOrganizations = async () => {
	const response = await organizationApi.getOrganizations();
	const payload = response?.data;
	const organizations = payload?.organizations;

	return organizations;
};

export const postOrganization = async({ name }: { name: string }) => {
	try {
		const response = await organizationApi.postOrganization(name);
		const payload = response?.data;
		const organization: Organization = payload?.organization;
	
		const organizationMapCache: Record<string, Organization> = await GlobalStateManager.getState(GlobalStateType.ORGANIZATION_MAP_CACHE) ?? {};
		organizationMapCache[organization.id] = organization;
		await GlobalStateManager.setState(GlobalStateType.ORGANIZATION_MAP_CACHE, organizationMapCache);
		await storeOrganizationId(organization.id);
	
		return organization;

	} catch (error: any) {
		logger.error(`Error posting organization ${error}`);
	}
};

export const getCurrentOrganizationId = async (): Promise<string|null> => {
	const fileJSON: DoclinFile = await readDoclinFile();

	return fileJSON?.organizationId;
};

export const getOrganization = async (organizationId: string): Promise<Organization | { unauthorized: boolean }> => {
	const organizationMapCache: Record<string, Organization> = await GlobalStateManager.getState(GlobalStateType.ORGANIZATION_MAP_CACHE) ?? {};
	
	if (organizationMapCache[organizationId]) {
		return organizationMapCache[organizationId];
	}

	try {
		return apiFetchOrganization(organizationId);

	} catch {
		return UNAUTHORIZED;
	}
};

const apiFetchOrganization = async (organizationId: string) => {
	try {
		const response = await organizationApi.getOrganization(organizationId);
		const payload = response?.data;
		const organization: Organization = payload?.organization;

		const organizationMapCache: Record<string, Organization> = await GlobalStateManager.getState(GlobalStateType.ORGANIZATION_MAP_CACHE) ?? {};
		organizationMapCache[organizationId] = organization;
		await GlobalStateManager.setState(GlobalStateType.ORGANIZATION_MAP_CACHE, organizationMapCache);

		return organization;

	} catch {
		return UNAUTHORIZED;
	}
};

export const storeOrganizationId = async (organizationId: string) => {
	try {
		const fileJSON: DoclinFile = await readDoclinFile();

		if (fileJSON) {
			fileJSON["organizationId"] = organizationId;

			await writeDoclinFile(fileJSON);
		}
	} catch (error: any) {
		logger.error(`An error occurred: ${error.message}`);
	}
};

export const getCurrentOrganizationUsers = async (): Promise<User|undefined> => {
	const organizationId = await getCurrentOrganizationId();

	if (!organizationId) {
		return;
	}

	const response = await organizationApi.getOrganizationUsers(organizationId);
	const payload = response?.data;
	const members = payload?.organization?.members;
	
	return members;
};