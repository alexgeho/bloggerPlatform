import type { CookieOptions } from 'express';
import { ENV } from '../config/env';

export const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: ENV.COOKIE_SECURE,
    sameSite: ENV.COOKIE_SAMESITE,
    path: '/',
    maxAge: Number(process.env.JWT_REFRESH_MAX_AGE_MS ?? 20_000),
};