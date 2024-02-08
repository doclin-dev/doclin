import organizationApi from "../api/organizationApi";
import { readDoclinFile, writeDoclinFile } from "../utils/doclinFileReadWriteUtil";
import logger from "../utils/logger";
import { DoclinFile } from "../types";

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
	const response = await organizationApi.postOrganization(name);
	const payload = response?.data;
	const organization = payload?.organization;

	await storeOrganizationId(organization.id);

	return organization;
};

export const getCurrentOrganizationId = async (): Promise<string|null> => {
    const fileJSON: DoclinFile = await readDoclinFile();

    return fileJSON?.organizationId;
}

export const getCurrentOrganization = async () => {
	const organizationId = await getCurrentOrganizationId();
    
	if (organizationId) {    
		try {
			const response = await organizationApi.getOrganization(organizationId);
			const payload = response?.data;
			const organization = payload?.organization;

			return organization;
		} catch {
			return UNAUTHORIZED;
		}
	}

	return null;
};

export const storeOrganizationId = async (organizationId: string) => {
    try {
        const fileJSON: DoclinFile = await readDoclinFile();

		if (fileJSON) {
			fileJSON["organizationId"] = organizationId;

			writeDoclinFile(fileJSON);
		}
	} catch (error: any) {
		logger.error(`An error occurred: ${error.message}`);
	}
};

export const getCurrentOrganizationUsers = async () => {
	const organizationId = await getCurrentOrganizationId();

	if (!organizationId) {
		return;
	}

	const response = await organizationApi.getOrganizationUsers(organizationId);
	const payload = response?.data;
	const members = payload?.organization?.members;
	
	return members;
};