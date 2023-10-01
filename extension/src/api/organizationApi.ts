import { createAxiosInstance } from "./apiService";

const baseOrganizationUrl = `/organizations`;

const getOrganizations = async () => {
    const apiService = createAxiosInstance();
    const response = await apiService.get(baseOrganizationUrl);

    return response;
}

const postOrganization = async(name: string) => {
    const data = {
        name: name
    };

    const apiService = createAxiosInstance();
    const response = await apiService.post(baseOrganizationUrl, data);

    return response;
}

export default {
    getOrganizations,
    postOrganization
}