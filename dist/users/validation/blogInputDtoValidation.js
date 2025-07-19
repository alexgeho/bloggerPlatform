"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogInputDtoValidation = void 0;
const blogInputDtoValidation = (data) => {
    const errors = [];
    if (!data.name ||
        typeof data.name !== 'string' ||
        data.name.trim().length < 2 ||
        data.name.trim().length > 15) {
        errors.push({ field: 'name', message: 'Invalid name' });
    }
    if (!data.description ||
        typeof data.description !== 'string' ||
        data.description.trim().length < 8 ||
        data.description.trim().length > 15) {
        errors.push({ field: 'description', message: 'Minimum 8 symbols must be' });
    }
    if (!data.websiteUrl ||
        typeof data.websiteUrl !== 'string' ||
        data.websiteUrl.trim().length < 5 ||
        data.websiteUrl.trim().length > 100) {
        errors.push({ field: 'websiteUrl', message: 'Invalid websiteUrl' });
    }
    return errors;
};
exports.blogInputDtoValidation = blogInputDtoValidation;
