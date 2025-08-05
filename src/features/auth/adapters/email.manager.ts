import { emailAdapter } from './email.adapter';
import { templates } from './email.templates';

export const emailManager = {
    async sendConfirmationEmail(email: string, code: string): Promise<void> {
        const html = templates.confirmation(code);
        const subject = 'Confirm your registration';
        emailAdapter.sendEmail(email, subject, html);
    },
};
