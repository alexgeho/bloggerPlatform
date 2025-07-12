"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPostListPaginatedOutput = mapToPostListPaginatedOutput;
function mapToPostListPaginatedOutput(posts, meta) {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: posts.map((post) => {
            var _a;
            return ({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: (_a = post.blogName) !== null && _a !== void 0 ? _a : null,
                createdAt: post.createdAt,
            });
        }), // <-- вот тут закрываем map, всё!
    };
}
