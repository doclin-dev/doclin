import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../envConstants';

const SENDER_EMAIL: string = 'noreply@doclin.dev';
const SENDER_NAME: string = 'Doclin';

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