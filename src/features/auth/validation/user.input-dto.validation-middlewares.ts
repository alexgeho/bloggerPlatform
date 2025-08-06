import { body } from 'express-validator';

const loginValidation = body('login')
    .isString()
    .withMessage('Login should be string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Length of login is not correct');

const passwordValidation = body('password')
    .isString()
    .withMessage('password should be string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Length of description is not correct');

const  emailValidation = body('email')
    .isString()
    .withMessage('Email should be string')
    .trim()
    // .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)
    // .withMessage('Email pattern is not valid');



export const userInputDtoValidation = [
    loginValidation,
    passwordValidation,
    emailValidation

];
