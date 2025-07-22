"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idValidation = void 0;
var express_validator_1 = require("express-validator");
var mongodb_1 = require("mongodb");
// Проверяет, что id — валидный MongoDB ObjectId
exports.idValidation = [
    (0, express_validator_1.param)('id')
        .exists()
        .withMessage('ID param is required')
        .bail() // остановит валидацию, если ID отсутствует
        .notEmpty()
        .withMessage('ID cannot be empty')
        .bail()
        .custom(function (value) { return mongodb_1.ObjectId.isValid(value); })
        .withMessage('ID must be a valid MongoDB ObjectId'),
];
//# sourceMappingURL=params-id.validation-middleware.js.map