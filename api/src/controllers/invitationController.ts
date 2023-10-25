import { Request, Response } from "express";
import { sendEmailFromDoclin } from "./emailNotificationController";
import { InvitationRepository } from "../database/repositories/InvitationRepository";
import crypto from "crypto";

const INVITATION_EMAIL_SUBJECT: string = "Doclin Invitation Code";

export const sendInvitation = async (req: Request, res: Response) => {
    const organizationId: string = req.params.organizationId;
    const email: string = req.body.email;

    const token = await generateUniqueInvitationToken();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 2);

    InvitationRepository.create({
        invitationCode: token,
        organizationId: organizationId,
        email: email,
        expireAt: expiryDate
    }).save();

    sendInvitationEmail(email, token);

    return res.send({ email: email });
}

const sendInvitationEmail = (recipientEmail: string, invitationCode: string) => {
    const message = `Here's your invitation code for Doclin: ${invitationCode}`;
    sendEmailFromDoclin(recipientEmail, INVITATION_EMAIL_SUBJECT, message);
}

const generateUniqueInvitationToken = async (): Promise<string> => {
    let uniqueToken: string;
    let tokenExists: boolean = true;
  
    do {
        uniqueToken = generateRandomToken(8);
        const invitation = await InvitationRepository.findUnexpiredInvitationByCode(uniqueToken);
        tokenExists = invitation ? true : false;
    } while (tokenExists);
  
    return uniqueToken;
}

const generateRandomToken = (length: number): string => {
    const bytes = crypto.randomBytes(Math.ceil(length / 2));
    const token = bytes.toString('hex');
    
    return token.slice(0, length);
}