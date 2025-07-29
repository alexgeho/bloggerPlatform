import { body } from 'express-validator';

const loginValidation = body('login')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Length of login is not correct')
    // .matches(/^[a-zA-Z0-9_-]*$/)
    // .withMessage('login format is not valid');

const passwordValidation = body('password')
    .isString()
    .withMessage('password should be string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Length of password should be minumum 6 symbols');

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
