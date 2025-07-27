import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog';
import { ResourceType } from '../../../../core/types/resource-type';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated.output';
import { BlogDataOutput } from '../output/blog-data.output';

export function mapToBlogListPaginatedOutput(
    blogs: WithId<Blog>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): BlogListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: blogs.map((blog: WithId<Blog>): BlogDataOutput => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        })),
    };
}

