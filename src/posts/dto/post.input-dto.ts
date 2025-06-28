// src/blogs/dto/blog.input-dto.ts

export type PostInputDto = {
    id: number,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    createdAt: string; // ✅ приведи к string (если ещё не так)
};