import {NextFunction, Request,Response} from "express";
const WINDOW_SIZE_IN_MINUTES = 1;
const MAX_REQUESTS_PER_WINDOW = 5;

type RateLimitRecord = {
    count: number;
    firstRequestTimestamp: number;
}

const WINDOW_SIZE_IN_MS = 10 * 1000;
const MAX_REQUESTS = 5;

const requestMap = new Map<string, RateLimitRecord>();

export const rateLimiter = (req: Request, res: Response, next: NextFunction)=> {
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
                 res.status(429).json({ message: 'Too many requests, try again later.' })
                return;
            } else {
                record.count += 1;
                requestMap.set(key, record);
            }
        } else {
            requestMap.set(key, { count: 1, firstRequestTimestamp: currentTime });
        }
    } else {
        requestMap.set(key, { count: 1, firstRequestTimestamp: currentTime });
    }

    next();
}