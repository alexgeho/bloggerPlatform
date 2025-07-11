import { WithId } from 'mongodb';
import { Post } from '../../domain/post';
import {PostDataOutput} from '../output/post-data.output';

export function mapToPostOutput(post: WithId<Post>): PostDataOutput {
    return {
        id: post._id.toString(),
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
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
