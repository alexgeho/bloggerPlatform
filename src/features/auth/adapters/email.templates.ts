export const templates = {

    confirmation: (code: string): string => {
        return `
  <h1>Thank you for your registration</h1>
  <p>To finish registration please follow the link below:
    <a href='https://alexgeho.github.io/bloggerPlatform-front/email-confirmed?code=${code}'>complete registration</a>
  </p>
`;
    },

    recovery: (code: string): string => {
        return `
        <h1>Confirm password recovery</h1>
        <p>To confirm password recovery please follow the link below:</p>
        <a href='https://alexgeho.github.io/bloggerPlatform-front/password-recovery?code=${code}'>confirm password recovery</a>
        `;

    }

};

