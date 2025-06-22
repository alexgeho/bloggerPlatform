// src/blogs/dto/blog.input-dto.ts

export type PostInputDto = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
};