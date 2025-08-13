export const ENV = {
    PORT: Number(process.env.PORT) || 3000,
    ORIGIN: process.env.ORIGIN || 'http://localhost:3000',
    COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',
    COOKIE_SAMESITE: (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') || 'lax',
    RT_TIME: Number(process.env.RT_TIME) || 20, // <-- добавили сюда
};
