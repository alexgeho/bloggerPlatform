import { ResourceType } from '../../../../core/types/resource-type';

export type PostCreateInput = {
    data: {
        type: ResourceType.Posts;
    };
};
