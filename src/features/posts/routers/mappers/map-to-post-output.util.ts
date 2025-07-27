import { WithId } from 'mongodb';
import { PostDb } from '../../domain/postDb';
import {PostDataOutput} from '../output/post-data.output';

export function mapToPostOutput(post: WithId<PostDb>): PostDataOutput {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName ?? null,
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
