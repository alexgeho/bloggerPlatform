import { body } from 'express-validator';

const nameValidation = body('name')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 2, max: 15 })
    .withMessage('Length of name is not correct');

const descriptionValidation = body('description')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage('Length of description is not correct');

const websiteUrlValidation = body('websiteUrl')
    .isString()
    .withMessage('websiteUrl should be string')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Length of websiteUrl is not correct')
    .isURL();



export const blogInputDtoValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation
];
