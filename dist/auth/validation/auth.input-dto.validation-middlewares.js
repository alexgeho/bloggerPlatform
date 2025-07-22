"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authInputDtoValidation = void 0;
var express_validator_1 = require("express-validator");
var loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail')
    .isString()
    .withMessage('loginOrEmail should be string')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Length of name is not correct');
var passwordValidation = (0, express_validator_1.body)('password')
    .isString()
    .withMessage('password should be string')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Length of description is not correct');
exports.authInputDtoValidation = [
    loginOrEmailValidation,
    passwordValidation
];
//# sourceMappingURL=auth.input-dto.validation-middlewares.js.map