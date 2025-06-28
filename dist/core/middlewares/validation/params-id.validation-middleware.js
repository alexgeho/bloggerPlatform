"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idValidation = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
// Проверяет, что id — валидный MongoDB ObjectId
exports.idValidation = [
    (0, express_validator_1.param)('id')
        .custom((value) => mongodb_1.ObjectId.isValid(value))
        .withMessage('ID must be a valid MongoDB ObjectId'),
];
