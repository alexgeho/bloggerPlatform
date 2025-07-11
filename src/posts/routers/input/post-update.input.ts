import { ResourceType } from '../../../core/types/resource-type';

export type PostUpdateInput = {
    data: {
        type: ResourceType.Posts;
        id: string;
    };
};
