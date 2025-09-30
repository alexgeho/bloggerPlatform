import { body } from 'express-validator';

const contentValidation = body('content')
    .notEmpty()
    .withMessage('comment must be')
    .isString()
    .withMessage('comment should be string')
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Length of comment is not correct');




export const contentInputDtoValidation = [
    contentValidation
];