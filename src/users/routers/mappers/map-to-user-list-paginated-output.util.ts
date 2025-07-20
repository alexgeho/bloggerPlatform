import { WithId } from 'mongodb';
import { User } from '../../domain/user';
import { ResourceType } from '../../../core/types/resource-type';
import { UserListPaginatedOutput } from '../output/user-list-paginated.output';
import { UserDataOutput } from '../output/user-data.output';

export function mapToUserListPaginatedOutput(
    users: WithId<User>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): UserListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: users.map((user: WithId<User>): UserDataOutput => ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        })),
    };
}

