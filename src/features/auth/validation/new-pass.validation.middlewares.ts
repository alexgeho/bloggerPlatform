import {body} from 'express-validator';

export const newPassValidationMiddlewares = body('email')
    .isString()
    .withMessage('password should be string')
    .isLength({ min: 6, max: 20 })
    .withMessage('Length of description is not correct')