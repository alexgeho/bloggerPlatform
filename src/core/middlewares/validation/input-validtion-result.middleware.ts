import { FieldValidationError, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorType } from '../../types/validationError';
import { HttpStatus } from '../../types/http-statuses';
import { ValidationErrorDto } from '../../types/validationError.dto';

export const createErrorMessages = (errors: ValidationErrorType[]): ValidationErrorDto => {
    return { errorsMessages: errors };
};

const formatErrors = (error: ValidationError): ValidationErrorType => {
    const expressError = error as unknown as FieldValidationError;

    return {
        message: expressError.msg,
        field: expressError.path,

    };
};

export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true })
console.log(errors);
    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
        return;
    }



    next();



};
