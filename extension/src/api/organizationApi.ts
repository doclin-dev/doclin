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

const inviteUser = async (organizationId: string, email: string) => {
    const data = {
        email: email
    };

    const apiService = createAxiosInstance();
    const invitationUrl = `${baseOrganizationUrl}/${organizationId}/invite`;

    const response = await apiService.post(invitationUrl, data);

    return response;
}

export default {
    getOrganizations,
    postOrganization,
    getOrganization,
    inviteUser
}