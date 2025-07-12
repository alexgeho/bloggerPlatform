import { ResourceType } from '../../../core/types/resource-type';

export type PostUpdateInput = {
    data: {
        type: ResourceType.Posts;
        id: string;
        title?: string;
        shortDescription?: string;
        content?: string;
        blogId?: string;
        createdAt?: string;
    };
};
