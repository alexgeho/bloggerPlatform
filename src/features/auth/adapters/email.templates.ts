export const templates = {
    confirmation: (code: string): string => {
        return `
      <h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
        <a href='https://blogger-platform-pi.vercel.app/confirm-email?code=${code}'>complete registration</a>
      </p>
    `;
    },
};
