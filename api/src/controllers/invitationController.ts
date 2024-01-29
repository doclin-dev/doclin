import { Request, Response } from "express";
import { sendEmailFromDoclin } from "./emailNotificationController";
import { InvitationRepository } from "../database/repositories/InvitationRepository";
import crypto from "crypto";
import { Invitation } from "../database/entities/Invitation";
import { User } from "../database/entities/User";
import { UserRepository } from "../database/repositories/UserRepository";
import { OrganizationRepository } from "../database/repositories/OrganizationRepository";

const INVITATION_EMAIL_SUBJECT: string = "Doclin Invitation Code";
const INVITATION_EXPIRED_MSG: string = "Invitation expired!";

export const sendInvitation = async (req: Request, res: Response) => {
    const organizationId: string = req.params.organizationId;
    const projectId: number = parseInt(req.params.projectId);
    const email: string = req.body.email;

    const token: string = await generateUniqueInvitationCode();
    saveUniqueInvitationCode(email, token, projectId, organizationId);
    sendInvitationEmail(email, token);

    return res.send({ email: email });
}

const generateUniqueInvitationCode = async (): Promise<string> => {
    let uniqueToken: string;
    let tokenExists: boolean = true;
  
    do {
        uniqueToken = generateRandomToken(8);
        const invitation: Invitation | null = await InvitationRepository.findUnexpiredInvitationByCode(uniqueToken);
        tokenExists = invitation ? true : false;
    } while (tokenExists);
  
    return uniqueToken;
}

const saveUniqueInvitationCode = (email: string, invitationCode: string, projectId: number, organizationId: string) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 2);

    InvitationRepository.create({
        email: email,
        invitationCode: invitationCode,
        projectId: projectId,
        organizationId: organizationId,
        expireAt: expiryDate
    }).save();
}

const sendInvitationEmail = (recipientEmail: string, invitationCode: string) => {
    const message = `Here's your invitation code for Doclin: ${invitationCode}`;
    sendEmailFromDoclin([recipientEmail], INVITATION_EMAIL_SUBJECT, message);
}

const generateRandomToken = (length: number): string => {
    const bytes = crypto.randomBytes(Math.ceil(length / 2));
    const token = bytes.toString('hex');
    
    return token.slice(0, length);
}

export const redeemInvitation = async (req: Request, res: Response) => {
    const invitationCode = req.body.invitationCode;
    const userId = req.userId;

    const user: User | null = await UserRepository.findUserById(userId);
    const invitation: Invitation | null = await InvitationRepository.findUnexpiredInvitationByCode(invitationCode);

    if (!invitation || !user) {
        return res.status(403).send({ error: INVITATION_EXPIRED_MSG });
    }

    try {
        await OrganizationRepository.addAuthorizedUser(invitation.organization, user);
    } catch {
        console.error("User already added");
    }

    await invitation.remove();

    return res.send({
        organizationId: invitation.organizationId,
        projectId: invitation.projectId
    });
}