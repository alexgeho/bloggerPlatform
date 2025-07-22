"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogInputDtoValidation = void 0;
var express_validator_1 = require("express-validator");
var nameValidation = (0, express_validator_1.body)('loginOrEmail')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 2, max: 15 })
    .withMessage('Length of name is not correct');
var descriptionValidation = (0, express_validator_1.body)('description')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Length of description is not correct');
var websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .isString()
    .withMessage('websiteUrl should be string')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Length of websiteUrl is not correct')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('websiteUrl format is not valid');
exports.blogInputDtoValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation
];
//# sourceMappingURL=blog.input-dto.validation-middlewares.js.map