import { createAxiosInstance } from './apiService';

const getBaseProjectUrl = (organizationId: string) => {
  return `/organizations/${organizationId}/projects`;
};

const getProjects = async (organizationId: string) => {
  const apiService = await createAxiosInstance();
  const baseProjectUrl = getBaseProjectUrl(organizationId);

  const response = await apiService.get(baseProjectUrl);

  return response;
};

const postProject = async (organizationId: string, name: string, privateProject: boolean) => {
  const data = {
    name: name,
    privateProject: privateProject,
  };

  const apiService = await createAxiosInstance();
  const baseProjectUrl = getBaseProjectUrl(organizationId);
  const response = await apiService.post(baseProjectUrl, data);

  return response;
};

const getProject = async (projectId: number, organizationId: string) => {
  const apiService = await createAxiosInstance();
  const baseProjectUrl = getBaseProjectUrl(organizationId);

  const response = await apiService.get(`${baseProjectUrl}/${projectId}`);

  return response;
};

export default {
  getProjects,
  postProject,
  getProject,
};
