import { body } from 'express-validator';

const codeValidation = body('code')
    .isString()
    .withMessage('code should be string')
    .trim()



export const codeInputDtoValidation = [
    codeValidation
];
