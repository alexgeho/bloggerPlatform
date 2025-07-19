import { WithId } from 'mongodb';
import { User } from '../../domain/user';
import { ResourceType } from '../../../core/types/resource-type';
import { UserListPaginatedOutput } from '../output/user-list-paginated.output';
import { BlogDataOutput } from '../output/blog-data.output';

export function mapToBlogListPaginatedOutput(
    blogs: WithId<User>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): UserListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: blogs.map((blog: WithId<User>): BlogDataOutput => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        })),
    };
}

