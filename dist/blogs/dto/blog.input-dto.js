"use strict";
// src/blogs/dto/blog.input-dto.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlogInputDto = validateBlogInputDto;
// функция-валидатор!
function validateBlogInputDto(input) {
    const errors = [];
    if (!input.name || typeof input.name !== 'string' || input.name.trim().length < 3) {
        errors.push({ field: 'name', message: 'Name is required and must be at least 3 characters.' });
    }
    if (!input.description || typeof input.description !== 'string') {
        errors.push({ field: 'description', message: 'Description is required.' });
    }
    if (!input.websiteUrl || typeof input.websiteUrl !== 'string' || !/^https?:\/\//.test(input.websiteUrl)) {
        errors.push({ field: 'websiteUrl', message: 'Website URL must be a valid URL.' });
    }
    return errors;
}
