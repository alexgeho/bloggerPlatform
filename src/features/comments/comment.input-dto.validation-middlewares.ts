import { body } from 'express-validator';

const contentValidation = body('content')
    .trim()
    .notEmpty()
    .withMessage('comment must be')
    .isString()
    .withMessage('comment should be string')
    .isLength({ max: 300 })
    .withMessage('Length of comment is not correct');




export const contentInputDtoValidation = [
    contentValidation
];