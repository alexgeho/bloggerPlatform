"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInputDtoValidation = void 0;
const express_validator_1 = require("express-validator");
const titleValidation = (0, express_validator_1.body)('title')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 2, max: 15 })
    .withMessage('Length of name is not correct');
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Length of description is not correct');
const contentValidation = (0, express_validator_1.body)('content')
    .isString()
    .withMessage('content should be string')
    .trim()
    .isLength({ min: 5, max: 150 })
    .withMessage('Length of content is not correct');
const blogIdValidation = (0, express_validator_1.body)('blogId')
    .isString()
    .withMessage('blogId should be string')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Length of blogId is not correct');
exports.postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];
