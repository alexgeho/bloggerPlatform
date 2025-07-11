import { ResourceType } from '../../../core/types/resource-type';

export type BlogPostInput = {
    data: {
        type: ResourceType.Blogs;
    };
};
