import { PostListPaginatedOutput } from '../output/post-list-paginated.output';
import { PostDataOutput } from '../output/post-data.output';

export function mapToPostListPaginatedOutput(
    posts: PostDataOutput[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): PostListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: posts, // 👈 они уже в готовом виде, маппить не нужно
    };
}
