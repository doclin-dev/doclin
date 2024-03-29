import * as vscode from "vscode";
import { authenticate, logout, postUserEmail } from "./providerHelpers/authenticationProviderHelper";
import { postThread, deleteThread, getThreadsByActiveFilePath, updateThread, getAllThreads } from "./providerHelpers/threadProviderHelper";
import { storeProjectId } from "./providerHelpers/projectProviderHelper";
import { getExistingProjects, postProject } from "./providerHelpers/projectProviderHelper";
import { deleteReply, getRepliesByThreadId, postReply, updateReply } from "./providerHelpers/replyProviderHelper";
import { postOrganization, getExistingOrganizations, storeOrganizationId, getCurrentOrganizationUsers } from "./providerHelpers/organizationProviderHelper";
import { getExtensionState } from "./utils/sidebarProviderUtil";
import { inviteUser, redeemInvitation } from "./providerHelpers/invitationProviderHelper";
import { getGithubUrl } from "./utils/gitProviderUtil";
import { WebviewMessageFunction } from "./types";
import { onError, onInfo } from "./utils/loggerProviderUtil";
import { handleGetSidebarLoadingStatus } from "./utils/waitForSidebarToShow";

export const RESPONSE_PROVIDERS: Record<string, WebviewMessageFunction> = {
	getExtensionState: getExtensionState,
	getGithubUrl: getGithubUrl,
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
	postUserEmail: postUserEmail
};

export const VOID_PROVIDERS: Record<string, WebviewMessageFunction> = {
	logout: logout,
	onInfo: onInfo,
	onError: onError,
	getSidebarLoadingStatus: handleGetSidebarLoadingStatus,
};

export const executeRemainingHandlers = (message: any, webview: vscode.Webview) => {
	switch (message.type) {
	case "authenticate":
		authenticate(async () => {
			webview.postMessage({
				type: "getExtensionState",
				value: await getExtensionState(),
			});
		});
		break;
	}
};