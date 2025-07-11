"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToPostOutput = mapToPostOutput;
function mapToPostOutput(post) {
    var _a;
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: (_a = post.blogName) !== null && _a !== void 0 ? _a : null,
        createdAt: post.createdAt
    };
}
// import { WithId } from 'mongodb';
// import { Post } from '../../types/post';
// import { PostViewModel } from '../../types/post-view-model';
//
// export function mapToPostViewModel(post: WithId<Post>): PostViewModel {
//     return {
//         id: post._id.toString(),
//         title: post.title,
//         shortDescription: post.shortDescription,
//         content: post.content,
//         blogId: post.blogId,
//         blogName: post.blogName,
//         createdAt: post.createdAt,
//
//     };
// }
