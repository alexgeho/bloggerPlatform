import { body } from 'express-validator';

const contentValidation = body('content')
    .notEmpty()
    .withMessage('Content must be')
    .isString()
    .withMessage('Content should be string')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('Length of title is not correct');




export const contentInputDtoValidation = [
    contentValidation
];