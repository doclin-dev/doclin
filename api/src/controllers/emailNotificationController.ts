import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../envConstants';
import { UserRepository } from "../database/repositories/UserRepository";
import { ProjectRepository } from '../database/repositories/ProjectRepository';
import logger from '../logger';

const SENDER_EMAIL: string = 'noreply@doclin.dev';
const SENDER_NAME: string = 'Doclin';
const MENTION_EMAIL_SUBJECT = 'has mentioned you in doclin.';

export const sendEmailFromDoclin = (recipientEmails: string[], subject: string, message: string, sender?:string) => {
	if (!SENDGRID_API_KEY) {
		throw new Error("Sendgrid API key not set");
	}

	sgMail.setApiKey(SENDGRID_API_KEY);

	const msg = {
  		to: recipientEmails,
  		from: {
			email: SENDER_EMAIL,
			name: sender ?? SENDER_NAME,
  		},
  		subject: subject,
  		text: message,
  		html: message,
	};

	sgMail
		.send(msg)
		.then(() => {
			logger.info(`Invitation email has been successfully sent to ${recipientEmails.join(",")}.`);
		})
		.catch((error) => {
			logger.error(error);
		});
};

export const sendMentionEmailNotification = async (senderId: number, targetUserIds: number[], projectId: number, message: string) => {

	const sender = await UserRepository.findUserById(senderId);
    const senderName = sender?.name;
    const targetUsers = targetUserIds.map(async (mentionedUserId) => {
        const user = await UserRepository.findUserById(mentionedUserId);
        return user ? user.email : null;
    });

	const targetUserEmails = (await Promise.all(targetUsers)).filter((email) => email !== null) as string[];
    const project = await ProjectRepository.findProjectById(projectId);
    const projectName = project?.name;

	const emailSubject = `${senderName} ${MENTION_EMAIL_SUBJECT}`
    const emailMessage = `${senderName} has mentioned you on a thread in project ${projectName}. 
					${message}`

	if (targetUserEmails.length > 0){
		sendEmailFromDoclin(targetUserEmails, emailSubject, emailMessage, senderName);
	} else {
		return;
	}
}