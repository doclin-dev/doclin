import * as vscode from 'vscode';
import { authenticate, logout, registerEmail } from './providerHelpers/authenticationProviderHelper';
import {
  postThread,
  deleteThread,
  getThreadsByActiveFilePath,
  updateThread,
  getAllThreads,
  searchThreads,
} from './providerHelpers/threadProviderHelper';
import { storeProjectId } from './providerHelpers/projectProviderHelper';
import { getExistingProjects, postProject } from './providerHelpers/projectProviderHelper';
import { deleteReply, getRepliesByThreadId, postReply, updateReply } from './providerHelpers/replyProviderHelper';
import {
  postOrganization,
  getExistingOrganizations,
  storeOrganizationId,
  getCurrentOrganizationUsers,
} from './providerHelpers/organizationProviderHelper';
import { getExtensionState, reloadAndGetExtensionState } from './utils/extensionState';
import { inviteUser, redeemInvitation } from './providerHelpers/invitationProviderHelper';
import { WebviewMessage, WebviewMessageFunction } from './types';
import { onError, onInfo } from './utils/loggerProviderUtil';
import { handleGetSidebarLoadingStatus } from './utils/waitForSidebarToShow';
import { postCopilotPrompt } from './providerHelpers/copilotProvider';

export const RESPONSE_PROVIDERS: Record<string, WebviewMessageFunction> = {
  getExtensionState: getExtensionState,
  reloadAndGetExtensionState: reloadAndGetExtensionState,
  getThreadsByActiveFilePath: getThreadsByActiveFilePath,
  getAllThreads: getAllThreads,
  postThread: postThread,
  updateThread: updateThread,
  deleteThread: deleteThread,
  getExistingProjects: getExistingProjects,
  postProject: postProject,
  setCurrentProject: storeProjectId,
  postReply: postReply,
  getRepliesByThreadId: getRepliesByThreadId,
  updateReply: updateReply,
  deleteReply: deleteReply,
  postOrganization: postOrganization,
  getExistingOrganizations: getExistingOrganizations,
  setCurrentOrganization: storeOrganizationId,
  inviteUser: inviteUser,
  redeemInvitation: redeemInvitation,
  getCurrentOrganizationUsers: getCurrentOrganizationUsers,
  postCopilotPrompt: postCopilotPrompt,
  searchThreads: searchThreads,
  logout: logout,
};

export const VOID_PROVIDERS: Record<string, WebviewMessageFunction> = {
  onInfo: onInfo,
  onError: onError,
  getSidebarLoadingStatus: handleGetSidebarLoadingStatus,
};

export const executeRemainingHandlers = async (message: WebviewMessage, webview: vscode.Webview) => {
  switch (message.type) {
    case 'authenticate':
      authenticate(async () => {
        webview.postMessage({
          type: 'getExtensionState',
          value: await getExtensionState(),
        });
      });
      break;

    case 'registerEmail':
      webview.postMessage({
        type: 'getExtensionState',
        value: await registerEmail(message.value),
      });
  }
};
