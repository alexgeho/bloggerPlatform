import { param } from 'express-validator';
import { ObjectId } from 'mongodb';

export const blogIdValidationNested = (paramName: string) => [
    param(paramName)
        .exists().withMessage(`${paramName} param is required`)
        .bail()
        .notEmpty().withMessage(`${paramName} cannot be empty`)
        .bail()
        .custom((value: any) => ObjectId.isValid(value))
        .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
];
