import { validationResult, ValidationError } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const postForBlogBodyValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Получаем массив ошибок
    const errors: ValidationError[] = validationResult(req).array({ onlyFirstError: true });

    // Оставляем только нужные поля
    const allowedFields = ['title', 'shortDescription'];
    const filteredErrors = errors
        .map((e: any) => ({
            message: e.msg,
            field: e.param, // теперь точно!
        }))
        .filter(e => allowedFields.includes(e.field));


    if (filteredErrors.length > 0) {
        res.status(400).json({ errorsMessages: filteredErrors });
        return;
    }

    next();
};
