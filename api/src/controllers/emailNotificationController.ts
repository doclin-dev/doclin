import sgMail from '@sendgrid/mail';

const API_KEY: string|undefined = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL: string = 'noreply@doclin.dev';
const SENDER_NAME: string = 'Doclin';

export const sendEmailFromDoclin = (recipientEmail: string, subject: string, message: string) => {
    if (!API_KEY) {
        throw new Error("Sendgrid API key not set");
    }

    sgMail.setApiKey(API_KEY);

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
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        });
};