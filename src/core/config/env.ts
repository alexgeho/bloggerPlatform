export const ENV = {
    PORT: Number(process.env.PORT ?? 3000),
    ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',
    COOKIE_SAMESITE: (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') ?? 'strict',
};