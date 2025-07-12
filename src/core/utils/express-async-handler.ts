import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Оборачивает async-функцию в совместимую с Express сигнатуру
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
