import type { CookieOptions } from 'express';
import { ENV } from '../config/env';

export const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: ENV.COOKIE_SECURE,                  // <-- теперь зависит от ENV
    sameSite: ENV.COOKIE_SAMESITE,              // <-- тоже
    path: '/',
    maxAge: ENV.RT_TIME * 1000,
};
