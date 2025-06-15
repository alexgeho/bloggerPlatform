// src/blogs/dto/blog.input-dto.ts

export type BlogInputDto = {
    name: string;
    description: string;
    websiteUrl: string;
};

// функция-валидатор!
export function validateBlogInputDto(input: any): { field: string, message: string }[] {
    const errors: { field: string, message: string }[] = [];

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
