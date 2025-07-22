"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInputDtoValidation = void 0;
var express_validator_1 = require("express-validator");
var loginValidation = (0, express_validator_1.body)('login')
    .isString()
    .withMessage('name should be string')
    .trim()
    .isLength({ min: 2, max: 15 })
    .withMessage('Length of name is not correct');
var passwordValidation = (0, express_validator_1.body)('password')
    .isString()
    .withMessage('description should be string')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Length of description is not correct');
var emailValidation = (0, express_validator_1.body)('email')
    .isString()
    .withMessage('websiteUrl should be string')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Length of websiteUrl is not correct')
    .matches(/^[\w\.-]+@[a-zA-Z\d-]+\.[a-zA-Z\d\.-]+$/)
    .withMessage('email format is not valid');
exports.UserInputDtoValidation = [
    loginValidation,
    passwordValidation,
    emailValidation
];
//# sourceMappingURL=user.input-dto.validation-middlewares.js.map