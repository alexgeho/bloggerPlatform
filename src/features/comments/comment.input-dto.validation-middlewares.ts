import { body } from 'express-validator';

const contentValidation = body('likeStatus')
    .notEmpty()
    .withMessage('comment must be')
    .isString()
    .withMessage('comment should be string')
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage('Length of comment is not correct');




export const contentInputDtoValidation = [
    contentValidation
];