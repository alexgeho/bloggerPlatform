// src/core/http/cookie.ts
import type { CookieOptions } from 'express';
import { ENV } from '../config/env'; // если у тебя есть

export const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,                // тест требует Secure
    sameSite: 'strict',          // для автотеста подходит strict
    path: '/',
    maxAge: Number(ENV?.RT_TIME ?? process.env.RT_TIME ?? 20) * 1000,
};
