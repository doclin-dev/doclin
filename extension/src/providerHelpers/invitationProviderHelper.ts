import { apiService } from '../apiService';
import logger from '../utils/logger';
import { readDoclinFile } from './doclinFile/readDoclinFile';
import { storeOrganizationId } from './organizationProviderHelper';
import { storeProjectId } from './projectProviderHelper';

const INVITATION_EXPIRED: string = 'invitationExpired';
const INVITATION_EXPIRED_MSG: string = 'Invitation code is invalid/expired!';
const EMAIL_SENT_MSG: string = 'Invitation code has been sent to';
const EMAIL_INVALID_MSG: string = 'Email format is invalid!';

export const inviteUser = async ({ email }: { email: string }) => {
  const doclinFile = await readDoclinFile();
  const organizationId = doclinFile?.organizationId;
  const projectId = doclinFile?.projectId;

  if (!organizationId || !email || !projectId || !validateEmail(email)) {
    return;
  }

  const response = await apiService.invitation.inviteUser(projectId, organizationId, email);
  const payload = response?.data;

  logger.info(`${EMAIL_SENT_MSG} ${email}`, true);

  return payload;
};

const validateEmail = (email: string): boolean => {
  if (isEmailNotValid(email)) {
    logger.info(`${EMAIL_INVALID_MSG} ${email}`, true);
    return false;
  }

  return true;
};

const isEmailNotValid = (email: string) => {
  return !String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const redeemInvitation = async ({ invitationCode }: { invitationCode: string }) => {
  try {
    const response = await apiService.invitation.redeemInvitation(invitationCode);
    const payload = response?.data;
    const organizationId = payload?.organizationId;
    const projectId = payload?.projectId;

    await storeOrganizationId(organizationId);
    await storeProjectId(projectId);

    return payload;
  } catch {
    logger.info(INVITATION_EXPIRED_MSG, true);
    return INVITATION_EXPIRED;
  }
};
