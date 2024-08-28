import { PostSnippetBlot } from '../types';
import { createAxiosInstance } from './apiService';

const getBaseThreadUrl = (organizationId: string, projectId: number) => {
  return `/organizations/${organizationId}/projects/${projectId}/threads`;
};






const searchThreads = async (searchText: string, projectId: number, organizationId: string) => {
  const data = {
    searchText: searchText,
    projectId: projectId,
  };

  const apiService = await createAxiosInstance();
  const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
  const response = await apiService.get(`${baseThreadUrl}/search`, { data });

  return response;
};

export default {
  postThread,
  updateThread,
  deleteThread,
  searchThreads,
};
