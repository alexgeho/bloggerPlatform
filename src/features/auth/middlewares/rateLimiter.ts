import { NextFunction, Request, Response } from "express";

const WINDOW_SIZE_IN_MS = 10 * 1000; // 10 seconds
const MAX_REQUESTS = 5;

type RateLimitRecord = {
    count: number;
    firstRequestTimestamp: number;
};

const requestMap = new Map<string, RateLimitRecord>();

export const rateLimiter = (req: any, res: any, next: NextFunction) => {
    const ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket.remoteAddress ||
        req.ip || "::1";

    const route = req.url;
    const key = `${ip}:${route}`;

    const currentTime = Date.now();
    const record = requestMap.get(key);

    if (record) {
        const timeSinceFirstRequest = currentTime - record.firstRequestTimestamp;

        if (timeSinceFirstRequest < WINDOW_SIZE_IN_MS) {
            if (record.count >= MAX_REQUESTS) {
                console.log(`[RateLimiter] Blocked ${key}`);
                return res.status(429).json({ message: 'Too many requests, try again later.' });
            }

            record.count += 1;
            requestMap.set(key, record);
        } else {
            // Reset window
            requestMap.set(key, { count: 1, firstRequestTimestamp: currentTime });
        }
    } else {
        // First request
        requestMap.set(key, { count: 1, firstRequestTimestamp: currentTime });
    }

    next();
};
