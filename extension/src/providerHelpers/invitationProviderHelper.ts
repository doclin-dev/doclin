import invitationApi from "../api/invitationApi";
import { getCurrentOrganizationId, storeOrganizationId } from "./organizationProviderHelper";
import { getCurrentProjectId, storeProjectId } from "./projectProviderHelper";
import * as vscode from "vscode";

const INVITATION_EXPIRED: string = "invitationExpired";
const INVITATION_EXPIRED_MSG: string = "Invitation code is invalid/expired!";
const EMAIL_SENT_MSG: string = "Invitation code has been sent to";

export const inviteUser = async({ email }: { email: string }) => {
	const organizationId = await getCurrentOrganizationId();
	const projectId = await getCurrentProjectId();

	if (!organizationId || !email || !projectId) {
		return;
	}

    const response = await invitationApi.inviteUser(projectId, organizationId, email);
    const payload = response?.data;

    vscode.window.showInformationMessage(`${EMAIL_SENT_MSG} ${email}`);
	
    return payload;
}

export const redeemInvitation = async ({ invitationCode } : { invitationCode: string }) => {
    try {
        const response = await invitationApi.redeemInvitation(invitationCode);
        const payload = response?.data;
        const organizationId = payload?.organizationId;
        const projectId = payload?.projectId;

        await storeOrganizationId(organizationId);
        await storeProjectId(projectId);

        return payload;
    } catch {
        vscode.window.showInformationMessage(INVITATION_EXPIRED_MSG);
        return INVITATION_EXPIRED;
    }
}