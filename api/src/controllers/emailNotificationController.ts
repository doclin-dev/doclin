import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../envConstants';
import { UserRepository } from '../database/repositories/UserRepository';
import { ProjectRepository } from '../database/repositories/ProjectRepository';
import logger from '../logger';
import { User } from '../database/entities/User';
import { Project } from '../database/entities/Project';

const SENDER_EMAIL: string = 'noreply@doclin.dev';
const SENDER_NAME: string = 'Doclin';
const MENTION_EMAIL_SUBJECT = 'has mentioned you in doclin.';
const ANONYMOUS_USER = 'Anonymous User';
export const sendEmailFromDoclin = (recipientEmails: string[], subject: string, message: string, sender?: string) => {
  if (!SENDGRID_API_KEY) {
    throw new Error('Sendgrid API key not set');
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
      logger.info(`Email has been successfully sent to ${recipientEmails.join(',')}.`);
    })
    .catch((error) => {
      logger.error(error);
    });
};

export const sendMentionEmailNotification = async (
  senderId: number,
  targetUserIds: number[],
  projectId: number,
  message: string,
  anonymous: boolean = false
) => {
  let senderName: string | undefined = ANONYMOUS_USER;
  if (!anonymous) {
    const sender: User = await UserRepository.findUserById(senderId);
    senderName = sender.name;
  }

  const targetUsers: Promise<string>[] = targetUserIds.map(async (mentionedUserId) => {
    const user: User = await UserRepository.findUserById(mentionedUserId);
    return user.email;
  });

  const targetUserEmails: string[] = (await Promise.all(targetUsers)).filter((email) => email !== null) as string[];

  const project: Project = await ProjectRepository.findProjectById(projectId);
  const projectName: string = project.name;
  const emailSubject = `${senderName} ${MENTION_EMAIL_SUBJECT}`;
  const emailMessage = `${senderName} has mentioned you on a thread in project ${projectName}. 
					${message}`;

  sendEmailFromDoclin(targetUserEmails, emailSubject, emailMessage, senderName);
};
