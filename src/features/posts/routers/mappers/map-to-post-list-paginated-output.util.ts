import { WithId } from 'mongodb';
import { PostDb } from '../../domain/postDb';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';
import {PostDataOutput} from "../output/post-data.output";

export function mapToPostListPaginatedOutput(
    posts: WithId<PostDb>[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): PostListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: posts.map((post: WithId<PostDb>): PostDataOutput => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName ?? null,
            createdAt: post.createdAt,
        })), // <-- вот тут закрываем map, всё!
    };
}
