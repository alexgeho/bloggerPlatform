"use strict";
// src/posts/validation/post.input-dto-for-blog.validation-middlewares.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInputDtoForBlogValidation = void 0;
var express_validator_1 = require("express-validator");
exports.postInputDtoForBlogValidation = [
    (0, express_validator_1.body)('title')
        .exists({ checkFalsy: true }).withMessage('Title is required')
        .isString().withMessage('name should be string')
        .trim()
        .isLength({ min: 2, max: 30 }).withMessage('Length of title is not correct'),
    (0, express_validator_1.body)('shortDescription')
        .exists({ checkFalsy: true }).withMessage('ShortDescription is required')
        .isString().withMessage('description should be string')
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Length of description is not correct'),
    (0, express_validator_1.body)('content')
        .exists({ checkFalsy: true }).withMessage('Content is required')
        .isString().withMessage('content should be string')
        .trim()
        .isLength({ min: 5, max: 1000 }).withMessage('Length of content is not correct'),
];
//# sourceMappingURL=post.blogForPostInput.validation-middlewares.js.map