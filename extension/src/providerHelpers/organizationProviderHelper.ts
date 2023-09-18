import * as vscode from "vscode";
import organizationApi from "../api/organizationApi";

export const getExistingOrganizations = async () => {
    return "hello";
}

export const postOrganization = async({ name }: { name: string }) => {
    const response = await organizationApi.postOrganization(name);
    const payload = response?.data;
    const organization = payload?.organization;

    return organization;
}