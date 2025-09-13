import {body} from 'express-validator';

export const emailValidationMiddlewares = body('email')
    .isString()
    .withMessage('email should be string')
    .isEmail()
    .withMessage('invalid email');