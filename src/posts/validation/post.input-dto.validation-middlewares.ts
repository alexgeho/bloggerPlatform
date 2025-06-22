import { body } from 'express-validator';

const titleValidation = body('title')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 2, max: 15 })
    .withMessage('Length of name is not correct');

const shortDescriptionValidation = body('shortDescription')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Length of description is not correct');

const contentValidation = body('content')
    .isString()
    .withMessage('content should be string')
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage('Length of content is not correct');

const blogIdValidation = body('blogId')
    .isString()
    .withMessage('blogId should be string')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Length of blogId is not correct');



export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];