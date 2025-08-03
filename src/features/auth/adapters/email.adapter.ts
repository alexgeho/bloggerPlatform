import nodemailer from 'nodemailer';

type MailResult = boolean;

export const emailAdapter = {
    async sendEmail(to: string, subject: string, html: string): Promise<MailResult> {
        const transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.SMTP_USER || '66c2097e93aa55',
                pass: process.env.SMTP_PASS || '15b615951a856c',
            },
        });

        try {
            await transporter.sendMail({
                from: '"Alexander Gerhard" <alex@itgeho.com>',
                to,
                subject,
                html,
            });
            return true;
        } catch (error) {
            console.error('Email send error:', error);
            return false;
        }
    },
};