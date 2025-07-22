"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogIdValidationNested = void 0;
var express_validator_1 = require("express-validator");
var mongodb_1 = require("mongodb");
var blogIdValidationNested = function (paramName) { return [
    (0, express_validator_1.param)(paramName)
        .exists().withMessage("".concat(paramName, " param is required"))
        .bail()
        .notEmpty().withMessage("".concat(paramName, " cannot be empty"))
        .bail()
        .custom(function (value) { return mongodb_1.ObjectId.isValid(value); })
        .withMessage("".concat(paramName, " must be a valid MongoDB ObjectId")),
]; };
exports.blogIdValidationNested = blogIdValidationNested;
//# sourceMappingURL=blogId-validation.nested.js.map