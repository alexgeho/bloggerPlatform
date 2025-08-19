// src/services/rateLimiter.service.ts

/**
 * In-memory rate limiter.
 * Stores timestamps of login attempts per IP.
 * Cleans up old entries (older than 10 sec) automatically.
 */
export class RateLimiterService {
    private readonly attempts = new Map<string, number[]>();
    private readonly limit = 5;
    private readonly windowMs = 10_000; // 10 seconds

    /**
     * Returns true if IP exceeded max attempts within window.
     */
    isBlocked(ip: string): boolean {
        const now = Date.now();
        const timestamps = this.attempts.get(ip) || [];

        // Filter out old timestamps (older than window)
        const recent = timestamps.filter(ts => now - ts <= this.windowMs);
        this.attempts.set(ip, recent);

        return recent.length >= this.limit;
    }

    /**
     * Logs a new attempt for IP.
     */
    addAttempt(ip: string): void {
        const now = Date.now();
        const timestamps = this.attempts.get(ip) || [];
        timestamps.push(now);
        this.attempts.set(ip, timestamps);
    }
}

// Example usage in login service:
//
// if (rateLimiter.isBlocked(ip)) {
//   throw new TooManyRequestsException();
// }
// rateLimiter.addAttempt(ip);
