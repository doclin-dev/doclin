import { createAxiosInstance } from "./apiService";

const REDEEM_INVITATION_URL = "/redeemInvitation";

const getBaseProjectUrl = (organizationId: string) => {
	return `/organizations/${organizationId}/projects`;
};

const inviteUser = async (projectId: number, organizationId: string, email: string) => {
	const data = {
		email: email
	};

	const apiService = await createAxiosInstance();
	const invitationUrl = `${getBaseProjectUrl(organizationId)}/${projectId}/invite`;

	const response = await apiService.post(invitationUrl, data);

	return response;
};

const redeemInvitation = async (invitationCode: string) => {
	const data = {
		invitationCode: invitationCode
	};

	const apiService = await createAxiosInstance();
	const response = await apiService.post(REDEEM_INVITATION_URL, data);

	return response;
};

export default {
	inviteUser,
	redeemInvitation
};