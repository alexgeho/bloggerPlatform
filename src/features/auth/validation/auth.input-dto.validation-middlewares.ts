import { body } from 'express-validator';

const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .withMessage('loginOrEmail should be string')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Length of name is not correct');

const passwordValidation = body('password')
    .isString()
    .withMessage('password should be string')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Length of description is not correct');


export const authInputDtoValidation = [
    loginOrEmailValidation,
    passwordValidation
];
