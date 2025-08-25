import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

type SameSiteOpt = true | false | 'lax' | 'strict' | 'none';

const toBool = (v: string | undefined) => v === 'true';
const toNumber = (v: string | undefined, fallback: number) =>
    Number.isFinite(Number(v)) ? Number(v) : fallback;

export const ENV = {
    // Server
    PORT: toNumber(process.env.PORT, 5003),
    ORIGIN: process.env.ORIGIN || 'http://localhost:5003',

    // Cookies
    COOKIE_SECURE: toBool(process.env.COOKIE_SECURE),
    COOKIE_SAMESITE: (process.env.COOKIE_SAMESITE as SameSiteOpt) || 'lax',

    // JWT (секунды)
    AC_TIME: toNumber(process.env.AC_TIME, 10),   // access token ttl (s)
    RT_TIME: toNumber(process.env.RT_TIME, 20),   // refresh token ttl (s)
    AC_SECRET: process.env.AC_SECRET || '',
    RT_SECRET: process.env.RT_SECRET || '',

    // DB
    MONGO_URL: process.env.MONGO_URL || '',
    DB_NAME: process.env.DB_NAME || 'BloggerPlatform',
    DB_TYPE: process.env.DB_TYPE || '',

    // Mail
    EMAIL: process.env.EMAIL || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',

    // Gmail (если используешь)
    GMAIL_USER: process.env.GMAIL_USER || '',
    GMAIL_PASS: process.env.GMAIL_PASS || '',
} as const;

export type AppEnv = typeof ENV;
