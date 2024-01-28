import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../envConstants';
import { UserRepository } from "../database/repositories/UserRepository";
import { ProjectRepository } from '../database/repositories/ProjectRepository';

const SENDER_EMAIL: string = 'noreply@doclin.dev';
const SENDER_NAME: string = 'Doclin';
const MENTION_EMAIL_SUBJECT = 'has mentioned you in doclin.';

export const sendEmailFromDoclin = (recipientEmail: string, subject: string, message: string) => {
	if (!SENDGRID_API_KEY) {
		throw new Error("Sendgrid API key not set");
	}

	sgMail.setApiKey(SENDGRID_API_KEY);

	const msg = {
  		to: recipientEmail,
  		from: {
			email: SENDER_EMAIL,
			name: SENDER_NAME
  		},
  		subject: subject,
  		text: message,
  		html: message,
	};

	sgMail
		.send(msg)
		.then(() => {
			console.debug(`Invitation email sent to ${recipientEmail}`);
		})
		.catch((error) => {
			console.error(error);
		});
};

export const sendMentionEmailNotification = async (senderId: number, targetUserIds: number[], projectId: number, message: string) => {
	if (!SENDGRID_API_KEY) {
		throw new Error("Sendgrid API key not set");
	}

	sgMail.setApiKey(SENDGRID_API_KEY);

	const sender = await UserRepository.findUserById(senderId);
    const senderName = sender?.name;
    const targetUsers = targetUserIds.map(async (mentionedUserId) => {
        const user = await UserRepository.findUserById(mentionedUserId);
        return user ? user.email : null;
    });

	const resolvedTargetUserEmails = (await Promise.all(targetUsers)).filter((email) => email !== null) as string[];

    const project = await ProjectRepository.findProjectById(projectId);
    const projectName = project?.name;

	const emailSubject = `${senderName} ${MENTION_EMAIL_SUBJECT}`
    const emailMessage = `${senderName} has mentioned you on a thread in project ${projectName}. 
					${message}`

	const msg = {
  		to: resolvedTargetUserEmails,
  		from: {
			email: SENDER_EMAIL,
			name: senderName,
  		},
  		subject: emailSubject,
  		text: emailMessage,
  		html: message,
	};

	sgMail
		.send(msg)
		.then(() => {
			console.debug(msg.to);
			console.debug('Mentioned users have been notified via email.');
		})
		.catch((error) => {
			console.error(error);
		});
}