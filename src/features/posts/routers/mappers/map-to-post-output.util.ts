import {WithId} from 'mongodb';
import {PostDb} from '../../domain/postDb';
import {PostDataOutput} from '../output/post-data.output';
import {LikeForPostDocument} from "../../../likes/domain/like-for-post";

export function mapToPostOutput(post: WithId<PostDb>, likesExtended: any): PostDataOutput {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName ?? null,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: likesExtended.likesCount,
            dislikesCount: likesExtended.dislikesCount,
            myStatus: likesExtended.myStatus,
            newestLikes: Array.isArray(likesExtended.newestLikes)
                ? likesExtended.newestLikes.map((like: any) => ({
                    addedAt: like.addedAt,
                    userId: like.userId,
                    login: like.login,
                }))
                : [],
        },
    };
}
