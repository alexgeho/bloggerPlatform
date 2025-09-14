import {emailAdapter} from './email.adapter';
import {templates} from './email.templates';

export class EmailManager {

    async sendConfirmationEmail(email: string, code: string): Promise<void> {
        const html = templates.confirmation(code);
        const subject = 'Confirm your registration';
        await emailAdapter.sendEmail(email, subject, html);
    }

    async sendRecoveryCode(email: string, code: string): Promise<void> {
        const html = templates.recovery(code);
        const subject = 'Password recovery';
        await emailAdapter.sendEmail(email, subject, html);
    }


};
