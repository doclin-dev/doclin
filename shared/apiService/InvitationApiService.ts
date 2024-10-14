import { AbstracApiService } from './AbstractApiService';

export class InvitationApiService extends AbstracApiService {
  private REDEEM_INVITATION_URL = '/redeemInvitation';

  private getBaseProjectUrl(organizationId: string) {
    return `/organizations/${organizationId}/projects`;
  }

  public async inviteUser(projectId: number, organizationId: string, email: string) {
    const data = {
      email: email,
    };

    const invitationUrl = `${this.getBaseProjectUrl(organizationId)}/${projectId}/invite`;

    const response = await this.axiosInstance.post(invitationUrl, data);

    return response;
  }

  public async redeemInvitation(invitationCode: string) {
    const data = {
      invitationCode: invitationCode,
    };

    const response = await this.axiosInstance.post(this.REDEEM_INVITATION_URL, data);

    return response;
  }
}
