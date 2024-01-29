import { createAxiosInstance } from "./apiService";

const baseOrganizationUrl = `/organizations`;

const getOrganizations = async () => {
    const apiService = await createAxiosInstance();
    const response = await apiService.get(baseOrganizationUrl);

    return response;
}

const postOrganization = async (name: string) => {
    const data = {
        name: name
    };

    const apiService = await createAxiosInstance();
    const response = await apiService.post(baseOrganizationUrl, data);

    return response;
}

const getOrganization = async (organizationId: string) => {
    const params = {
        includeMembers: true
    }
    
    const apiService = await createAxiosInstance();
    const response = await apiService.get(`${baseOrganizationUrl}/${organizationId}`, {params});

    return response;
}

const getOrganizationUsers = async (organizationId: string) => {
    const params = {
        includeMembers: true
    }
    
    const apiService = await createAxiosInstance();
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