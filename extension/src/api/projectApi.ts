import { createAxiosInstance } from "./apiService";

const getBaseProjectUrl = (organizationId: string) => {
    return `/organizations/${organizationId}/projects`;
}

const getProjects = async (organizationId: string) => {
    const apiService = createAxiosInstance();
    const baseProjectUrl = getBaseProjectUrl(organizationId);

    const response = await apiService.get(baseProjectUrl);

    return response;
}

const postProject = async(organizationId: string, name: string, githubUrl: string) => {
    const data = {
        name: name,
        url: githubUrl
    };

    const apiService = createAxiosInstance();
    const baseProjectUrl = getBaseProjectUrl(organizationId);
    const response = await apiService.post(baseProjectUrl, data);

    return response;
}

const getProject = async (projectId: number, organizationId: string) => {
    const apiService = createAxiosInstance();
    const baseProjectUrl = getBaseProjectUrl(organizationId);

    const response = await apiService.get(`${baseProjectUrl}/${projectId}`);

    return response;
}

const inviteUser = async (projectId: number, organizationId: string, email: string) => {
    const data = {
        email: email
    };

    const apiService = createAxiosInstance();
    const invitationUrl = `${getBaseProjectUrl(organizationId)}/${projectId}/invite`;

    const response = await apiService.post(invitationUrl, data);

    return response;
}

export default {
    getProjects,
    postProject,
    getProject,
    inviteUser
}