export type PostDb = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: string;
};

export type PostView = PostDb & {
    blogName: string | null;
};