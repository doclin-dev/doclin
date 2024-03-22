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
import logger from "./utils/logger";


export const handleMessagePosting = (webview: vscode.Webview) => {
	webview.onDidReceiveMessage(async (message: { type: any, value: any }) => {
		switch (message.type) {
		case "logout":
			logout();
			break;
		case "authenticate":
			authenticate(async () => {
				webview.postMessage({
					type: "getExtensionState",
					value: await getExtensionState(),
				});
			});
			break;
		case "getExtensionState":
			webview.postMessage({
				type: "getExtensionState",
				value: await getExtensionState(),
			});
			break;
		case "onInfo":
			logger.info(message.value);
			break;
		case "onError":
			logger.error(message.value);
			break;
		case "getGithubUrl":
			webview.postMessage({
				type: "getGithubUrl",
				value: await getGithubUrl(),
			});
			break;
		case "getThreadsByActiveFilePath":
			webview.postMessage({
				type: "getThreadsByActiveFilePath",
				value: await getThreadsByActiveFilePath()
			});
			break;
		case "getAllThreads":
			webview.postMessage({
				type: "getAllThreads",
				value: await getAllThreads()
			});
			break;
		case "selectAThread":
			break;
		case "postThread":
			webview.postMessage({
				type: "postThread",
				value: await postThread(message.value)
			});
			break;
		case "updateThread":
			webview.postMessage({
				type: "updateThread",
				value: await updateThread(message.value)
			});
			break;
		case "deleteThread":
			webview.postMessage({
				type: "deleteThread",
				value: await deleteThread(message.value)
			});
			break;
		case "getExistingProjects":
			webview.postMessage({
				type: "getExistingProjects",
				value: await getExistingProjects()
			});
			break;
		case "postProject":
			webview.postMessage({
				type: "postProject",
				value: await postProject(message.value)
			});
			break;
		case "setCurrentProject":
			webview.postMessage({
				type: "setCurrentProject",
				value: await storeProjectId(message.value)
			});
			break;
		case "postReply":
			webview.postMessage({
				type: "postReply",
				value: await postReply(message.value)
			});
			break;
		case "getRepliesByThreadId":
			webview.postMessage({
				type: "getRepliesByThreadId",
				value: await getRepliesByThreadId(message.value)
			});
			break;
		case "getRepliesByThreadId":
			webview.postMessage({
				type: "getRepliesByThreadId",
				value: await getRepliesByThreadId(message.value)
			});
			break;
		case "updateReply":
			webview.postMessage({
				type: "updateReply",
				value: await updateReply(message.value)
			});
			break;
		case "deleteReply":
			webview.postMessage({
				type: "deleteReply",
				value: await deleteReply(message.value)
			});
			break;
		case "postOrganization":
			webview.postMessage({
				type: "postOrganization",
				value: await postOrganization(message.value)
			});
			break;
		case "getExistingOrganizations":
			webview.postMessage({
				type: "getExistingOrganizations",
				value: await getExistingOrganizations()
			});
			break;
		case "setCurrentOrganization":
			webview.postMessage({
				type: "setCurrentOrganization",
				value: await storeOrganizationId(message.value)
			});
			break;
		case "inviteUser":
			webview.postMessage({
				type: "inviteUser",
				value: await inviteUser(message.value)
			});
			break;
		case "redeemInvitation":
			webview.postMessage({
				type: "redeemInvitation",
				value: await redeemInvitation(message.value)
			});
			break;
		case "getCurrentOrganizationUsers":
			webview.postMessage({
				type: "getCurrentOrganizationUsers",
				value: await getCurrentOrganizationUsers()
			});
			break;
		case "postUserEmail":
			webview.postMessage({
				type: "postUserEmail",
				value: await postUserEmail(message.value)
			});
			break;
		}
	});
};
