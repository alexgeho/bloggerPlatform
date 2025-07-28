import { ResourceType } from '../../../../core/types/resource-type';

export type CommentCreateInput = {
    data: {
        type: ResourceType.Comments;
    };
};
