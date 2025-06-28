// src/blogs/dto/blog.input-dto.ts

export type BlogInputDto = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string; // ✅ приведи к string (если ещё не так)
    isMembership: false

};


