
export type blog = {
    id: number;
    name: string;
    description: string;
    websiteUrl: string;
};

// src/blogs/types/blog.ts или отдельный файл
export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
};
