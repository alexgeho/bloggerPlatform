import type { CookieOptions } from 'express';
import { ENV } from '../config/env';

// Express ожидает maxAge в МИЛЛИСЕКУНДАХ.
// У нас RT_TIME — в секундах, поэтому умножаем на 1000.
export const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: ENV.COOKIE_SECURE,
    sameSite: ENV.COOKIE_SAMESITE,
    path: '/',
    maxAge: ENV.RT_TIME * 1000,
};
