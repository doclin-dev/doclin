import { GlobalStateManager } from "../GlobalStateManager";
import { createAxiosInstance } from "./apiService";

const baseOrganizationUrl = `/organizations`;

const getOrganizations = async (githubUrl: string) => {
    const params = {
        githubUrl: githubUrl
    };

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.get(baseOrganizationUrl + "/existing", { params });

    return response;
}

const postOrganization = async(name: string) => {
    const data = {
        name: name
    };

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.post(baseOrganizationUrl, data);

    return response;
}

export default {
    getOrganizations,
    postOrganization
}