"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInputDtoValidation = void 0;
var express_validator_1 = require("express-validator");
var titleValidation = (0, express_validator_1.body)('title')
    .notEmpty()
    .withMessage('Title must be')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Length of title is not correct');
var shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
    .notEmpty()
    .withMessage('ShortDescription must be')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Length of description is not correct');
var contentValidation = (0, express_validator_1.body)('content')
    .isString()
    .withMessage('content should be string')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Length of content is not correct')
    .notEmpty()
    .withMessage('Content must be');
var blogIdValidation = (0, express_validator_1.body)('blogId')
    .isString()
    .withMessage('blogId should be string')
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage('Length of blogId is not correct');
exports.postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
];
//# sourceMappingURL=post.input-dto.validation-middlewares.js.map