import { Invitation } from "../entities/Invitation";
import { AppDataSource } from "../dataSource";
import { MoreThan } from 'typeorm';

export const InvitationRepository = AppDataSource.getRepository(Invitation).extend({
    findUnexpiredInvitationByCode(invitationCode: string) {
        const currentDate = new Date();
        return this.findOneBy({ 
            invitationCode: invitationCode,
            expireAt: MoreThan(currentDate)
        });
    }
});