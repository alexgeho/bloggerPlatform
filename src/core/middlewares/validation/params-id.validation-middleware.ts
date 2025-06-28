import { param } from 'express-validator';
import { ObjectId } from 'mongodb';

// Проверяет, что id — валидный MongoDB ObjectId
export const idValidation = [
    param('id')
        .custom((value) => ObjectId.isValid(value))
        .withMessage('ID must be a valid MongoDB ObjectId'),
];
