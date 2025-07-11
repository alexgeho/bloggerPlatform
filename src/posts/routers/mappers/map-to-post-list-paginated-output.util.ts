import { WithId } from 'mongodb';
import { Post } from '../../domain/post';
import { ResourceType } from '../../../core/types/resource-type';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';
import {PostDataOutput} from "../output/post-data.output";

export function mapToPostListPaginatedOutput(
    posts: WithId<Post>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): PostListPaginatedOutput {
    return {
        pageCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: posts.map((post: WithId<Post>): PostDataOutput => ({
            id: post._id.toString(),
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        })),
    };
}

