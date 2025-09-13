import {body} from 'express-validator';

export const newPassValidationMiddlewares = body('newPassword')
    .notEmpty()
    .withMessage('newPassword should not be empty')
    .isString()
    .withMessage('password should be string')
    .isLength({ min: 6, max: 20 })
    .withMessage('Length of password should be between 6 and 20 characters');
