import { body } from 'express-validator';

const loginValidation = body('login')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage('Length of name is not correct');

const passwordValidation = body('password')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Length of description is not correct');

const emailValidation = body('email')
    .isString()
    .withMessage('websiteUrl should be string')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Length of websiteUrl is not correct')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('email format is not valid')



export const UserInputDtoValidation = [
    loginValidation,
    passwordValidation,
    emailValidation
];
