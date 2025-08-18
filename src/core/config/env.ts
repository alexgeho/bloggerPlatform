import dotenvFlow from 'dotenv-flow';
dotenvFlow.config()


export const ENV = {
    PORT: Number(process.env.PORT) || 5003,
    ORIGIN: process.env.ORIGIN || 'http://localhost:5003',
    COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',
    COOKIE_SAMESITE: (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') || 'lax',
    RT_TIME: Number(process.env.RT_TIME) || 2000, // <= это уже и есть TTL refresh токена
    AC_TIME: Number(process.env.AC_TIME) || 1000, // <= если нужен TTL access токена
    JWT_REFRESH_EXP_SEC: Number(process.env.RT_TIME) || 2000, // <-- добавь ЭТО (или используй RT_TIME напрямую)
    MONGO_URL: process.env.MONGO_URL || '',
    DB_NAME: process.env.DB_NAME || 'BloggerPlatform',
    AC_SECRET: process.env.AC_SECRET || '',
    RT_SECRET: process.env.RT_SECRET || '',
    GMAIL_USER: process.env.GMAIL_USER || '',
    GMAIL_PASS: process.env.GMAIL_PASS || '',
};
