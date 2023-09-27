import { GlobalStateManager } from "../GlobalStateManager";
import { getCurrentOrganizationId } from "../providerHelpers/organizationProviderHelper";
import { createAxiosInstance } from "./apiService";

const getBaseProjectUrl = (): string => {
    return `/organizations/${getCurrentOrganizationId()}/projects`;
}

const getProjects = async (githubUrl: string) => {
    const params = {
        githubUrl: githubUrl
    };

    const apiService = createAxiosInstance();
    const response = await apiService.get(getBaseProjectUrl(), { params });

    return response;
}

const postProject = async(name: string, githubUrl: string) => {
    const data = {
        name: name,
        url: githubUrl
    };

    const apiService = createAxiosInstance();
    const response = await apiService.post(getBaseProjectUrl(), data);

    return response;
}

export default {
    getProjects,
    postProject
}