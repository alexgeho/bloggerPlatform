import { ResourceType } from '../../../../core/types/resource-type';

export type UserCreateInput = {
    data: {
        type: ResourceType.Users;
    };
};
