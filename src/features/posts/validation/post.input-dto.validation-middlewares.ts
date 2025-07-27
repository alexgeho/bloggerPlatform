import { body } from 'express-validator';

const titleValidation = body('title')
    .notEmpty()
    .withMessage('Title must be')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Length of title is not correct');



const shortDescriptionValidation = body('shortDescription')
    .notEmpty()
    .withMessage('ShortDescription must be')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Length of description is not correct');


const contentValidation = body('content')
    .isString()
    .withMessage('content should be string')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Length of content is not correct')
    .notEmpty()
    .withMessage('Content must be');

const blogIdValidation = body('blogId')
    .isString()
    .withMessage('blogId should be string')
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage('Length of blogId is not correct');



export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];