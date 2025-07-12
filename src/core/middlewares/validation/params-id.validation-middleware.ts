import { param } from 'express-validator';
import { ObjectId } from 'mongodb';

// Проверяет, что id — валидный MongoDB ObjectId
export const idValidation = [

    param('id')
        .exists()
        .withMessage('ID param is required')
        .bail() // остановит валидацию, если ID отсутствует
        .notEmpty()
        .withMessage('ID cannot be empty')
        .bail()
        .custom((value) => ObjectId.isValid(value))
        .withMessage('ID must be a valid MongoDB ObjectId'),
];
