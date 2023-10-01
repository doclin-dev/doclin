import * as vscode from "vscode";
import organizationApi from "../api/organizationApi";
import { readDoclinFile, writeDoclinFile } from "../utils/fileReadWriteUtil";

export const getExistingOrganizations = async () => {
    const response = await organizationApi.getOrganizations();
    const payload = response?.data;
    const organizations = payload?.organizations;

    return organizations;
}

export const postOrganization = async({ name }: { name: string }) => {
    const response = await organizationApi.postOrganization(name);
    const payload = response?.data;
    const organization = payload?.organization;

    storeOrganizationId(organization.id);

    return organization;
}

export const getCurrentOrganizationId = async () => {
    const fileJSON = await readDoclinFile();

    return fileJSON?.organizationId;
}

export const getCurrentOrganization = async () => {
    const organizationid = await getCurrentOrganizationId();
    
}

export const setCurrentOrganization = async (organizationId: string) => {
    await storeOrganizationId(organizationId);
    return true;
}

const storeOrganizationId = async (organizationId: string) => {
    try {
        const fileJSON = await readDoclinFile();

        if (fileJSON) {
            fileJSON["organizationId"] = organizationId;

            writeDoclinFile(fileJSON);
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`An error occurred: ${error.message}`);
    }
}