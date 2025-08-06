export const templates = {
    confirmation: (code: string): string => {
        return `
  <h1>Thank you for your registration</h1>
  <p>To finish registration please follow the link below:
    <a href='https://alexgeho.github.io/bloggerPlatform-front/email-confirmed?code=${code}'>complete registration</a>
  </p>
        `;
    }
};

