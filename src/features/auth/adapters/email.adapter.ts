import nodemailer from 'nodemailer';

type MailResult = boolean;

export const emailAdapter = {
    async sendEmail(to: string, subject: string, html: string): Promise<MailResult> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.SMTP_USER || 'rasheed33@ethereal.email',
                pass: process.env.SMTP_PASS || 'dQXmchT8HR3Fs8R4Pb',
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