import { createAxiosInstance } from "./apiService";

const baseOrganizationUrl = `/organizations`;

const getOrganizations = async () => {
    const apiService = createAxiosInstance();
    const response = await apiService.get(baseOrganizationUrl);

    return response;
}

const postOrganization = async (name: string) => {
    const data = {
        name: name
    };

    const apiService = createAxiosInstance();
    const response = await apiService.post(baseOrganizationUrl, data);

    return response;
}

const getOrganization = async (organizationId: string) => {
    const apiService = createAxiosInstance();
    const response = await apiService.get(`${baseOrganizationUrl}/${organizationId}`);

    return response;
}

const getOrganizationUsers = async (organizationId: string) => {
    const params = {
        includeMembers: true
    }
    
    const apiService = createAxiosInstance();
    const invitationUrl = `${baseOrganizationUrl}/${organizationId}`;

    const response = await apiService.get(invitationUrl, { params });

    return response;
}

export default {
    getOrganizations,
    postOrganization,
    getOrganization,
    getOrganizationUsers
}