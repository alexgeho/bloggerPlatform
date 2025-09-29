import {Response, Request, NextFunction} from 'express'
import {RateLimitModel} from "../domain/rate-limit.mangoose";

export const requestLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    await RateLimitModel.insertOne({
        ip: req.ip as string,
        url: req.originalUrl,
        date: Date.now(),
    });

    let count = await RateLimitModel.countDocuments({
        ip: req.ip,
        url: req.originalUrl,
        date: { $gte: Date.now() - 10 * 1000 },
    });

    // console.log(req.originalUrl);
    // console.log(count);

    if (count > 5) {
        res.sendStatus(429);
        return;
    }

    next();
};