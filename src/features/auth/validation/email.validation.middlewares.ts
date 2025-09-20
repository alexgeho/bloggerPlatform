import {body} from 'express-validator';

export const emailValidationMiddlewares = body('email')
    .isString()
    .withMessage('email should be string')
    .isEmail()
    .withMessage('invalid email')
    // .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    // .withMessage('invalid email 2')