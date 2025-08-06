import { WithId } from 'mongodb';
import { User } from '../../../auth/domain/user';
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
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt.toISOString()
        })),
    };
}

