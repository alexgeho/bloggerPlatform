"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogIdValidationNested = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const blogIdValidationNested = (paramName) => [
    (0, express_validator_1.param)(paramName)
        .exists().withMessage(`${paramName} param is required`)
        .bail()
        .notEmpty().withMessage(`${paramName} cannot be empty`)
        .bail()
        .custom((value) => mongodb_1.ObjectId.isValid(value))
        .withMessage(`${paramName} must be a valid MongoDB ObjectId`),
];
exports.blogIdValidationNested = blogIdValidationNested;
