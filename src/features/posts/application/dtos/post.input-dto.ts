export type PostInputDto = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    createdAt: string; // ✅ приведи к string (если ещё не так)
};