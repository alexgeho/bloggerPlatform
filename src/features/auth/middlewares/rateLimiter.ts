// src/middlewares/rateLimiter.ts
import { NextFunction, Request, Response } from "express";

const WINDOW_MS = 10_000; // 10 seconds
const MAX_REQUESTS = 5;   // 6th within window => 429

type Counter = { count: number; first: number };
const buckets = new Map<string, Counter>();

function normalizeIp(ip: string | undefined | null): string {
    if (!ip) return "local";
    if (ip === "::1") return "127.0.0.1";        // localhost IPv6
    if (ip.startsWith("::ffff:")) return ip.slice(7); // IPv4-mapped IPv6
    return ip;
}

function extractClientIp(req: Request): string {
    const xf = req.headers["x-forwarded-for"];
    let forwarded = "";
    if (Array.isArray(xf) && xf.length) forwarded = xf[0];
    else if (typeof xf === "string") forwarded = xf;
    const fromHeader = forwarded ? forwarded.split(",")[0].trim() : "";
    const raw = fromHeader || req.ip || req.socket.remoteAddress || "::1";
    return normalizeIp(raw.toString());
}

function makeKey(req: Request): string {
    // стабильный путь без query и с учётом базового mount'а
    const stablePath = `${req.baseUrl || ""}${req.path || ""}`
        || (((req as any).originalUrl || req.url).split("?")[0]);
    return `${extractClientIp(req)}:${req.method}:${stablePath}`;
}

export function rateLimiter(req: any, res: any, next: NextFunction) {
    const key = makeKey(req);
    const now = Date.now();

    const rec = buckets.get(key);
    if (!rec) {
        buckets.set(key, { count: 1, first: now });
        return next();
    }

    const elapsed = now - rec.first;
    if (elapsed < WINDOW_MS) {
        if (rec.count >= MAX_REQUESTS) return res.sendStatus(429);
        rec.count += 1;
        buckets.set(key, rec);
        return next();
    }

    buckets.set(key, { count: 1, first: now });
    return next();
}

export function resetRateLimiter() {
    buckets.clear();
}
