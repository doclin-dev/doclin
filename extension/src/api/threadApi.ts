import { PostSnippetBlot } from '../types';
import { createAxiosInstance } from './apiService';

const getBaseThreadUrl = (organizationId: string, projectId: number) => {
  return `/organizations/${organizationId}/projects/${projectId}/threads`;
};

const getFileBasedThreads = async (organizationId: string, projectId: number, filePath: string) => {
  const params = {
    filePath: filePath,
  };

  const apiService = await createAxiosInstance();
  const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
  const response = await apiService.get(baseThreadUrl, { params });

  return response;
};

const getAllThreads = async (organizationId: string, projectId: number) => {
  const apiService = await createAxiosInstance();
  const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
  const response = await apiService.get(baseThreadUrl);

  return response;
};

const postThread = async (
  organizationId: string,
  projectId: number,
  title: string,
  threadMessage: string,
  delta: any,
  snippets: PostSnippetBlot[],
  gitBranch: string | null,
  filePath: string | null,
  mentionedUserIds: number[],
  anonymous: boolean
) => {
  const data = {
    delta: delta,
    title: title,
    threadMessage: threadMessage,
    snippets: snippets,
    filePath: filePath,
    mentionedUserIds: mentionedUserIds,
    anonymous: anonymous,
    gitBranch: gitBranch,
  };

  const apiService = await createAxiosInstance();
  const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
  const response = await apiService.post(baseThreadUrl, data);

  return response;
};

const updateThread = async (
  organizationId: string,
  projectId: number,
  threadId: number,
  title: string,
  threadMessage: string,
  delta: any,
  snippets: PostSnippetBlot[],
  activeEditorFilePath: string | null
) => {
  const data = {
    title: title,
    message: threadMessage,
    activeEditorFilePath: activeEditorFilePath,
    delta: delta,
    snippets: snippets,
  };

  const apiService = await createAxiosInstance();
  const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
  const response = await apiService.put(`${baseThreadUrl}/${threadId}`, data);

  return response;
};

const deleteThread = async (organizationId: string, projectId: number, threadId: number) => {
  const apiService = await createAxiosInstance();
  const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
  const response = await apiService.delete(`${baseThreadUrl}/${threadId}`);

  return response;
};

const searchThreads = async (searchText: string, projectId: number, organizationId: string) => {
  const data = {
    searchText: searchText,
  };

  const apiService = await createAxiosInstance();
  const baseThreadUrl = getBaseThreadUrl(organizationId, projectId);
  const response = await apiService.get(`${baseThreadUrl}/search`, { data });

  return response;
};

export default {
  getFileBasedThreads,
  getAllThreads,
  postThread,
  updateThread,
  deleteThread,
  searchThreads,
};
