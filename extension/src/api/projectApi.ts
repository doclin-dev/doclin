import { GlobalStateManager } from "../GlobalStateManager";
import { createAxiosInstance } from "./apiService";

const baseProjectUrl = `/projects`;

const getProjects = async (githubUrl: string) => {
    const params = {
        githubUrl: githubUrl
    };

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.get(baseProjectUrl + "/existing", { params });

    return response;
}

const postProject = async(name: string, githubUrl: string) => {
    const data = {
        name: name,
        url: githubUrl
    };

    const apiService = createAxiosInstance(GlobalStateManager.getState(GlobalStateManager.type.AUTH_TOKEN));
    const response = await apiService.post(baseProjectUrl, data);

    return response;
}

export default {
    getProjects,
    postProject
}