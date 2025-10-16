import {likesRepository} from "./likes.repository";
import {LikeStatus} from "./domain/like-status.enum";
import {userRepository, userService} from "../../composition-root";
import {LikeForPostDocument} from "./domain/like-for-post";

export const likesService = {

    // LIKES FOR POSTS

    async createLikeOnPost(postId: string, userId: string, likeStatus: string) {

        const likeExists = await likesRepository.findOne(postId, userId);

        if (!likeExists) {
            await likesRepository.createLikeOnPost(postId, userId, likeStatus)
        }
    },

    async findLikeOnPost(postId: string, userId?: string) {

        const likes: LikeForPostDocument[] = await likesRepository.findLikeOnPost(postId);

        console.log('repo.findLikeOnPost ->', likes)

        const likesCount = likes.filter(l => l.myStatus.toLowerCase() === LikeStatus.Like.toLowerCase()).length;
        const dislikesCount = likes.filter(l => l.myStatus.toLowerCase() === LikeStatus.Dislike.toLowerCase()).length;


        let myStatus: LikeStatus = LikeStatus.None;

        if (userId) {
            const myLike = likes.find(l => l.userId.toString() === userId);
            if (myLike)
                myStatus = myLike.myStatus as LikeStatus;
        }
        const newestLikesRaw = likes
            .filter(like => like.myStatus.toLowerCase() === LikeStatus.Like.toLowerCase())
            .sort((firstLike, secondLike) => {
                const firstCreatedAt = new Date(firstLike.createdAt).getTime();
                const secondCreatedAt = new Date(secondLike.createdAt).getTime();
                return secondCreatedAt - firstCreatedAt;
            })
            .slice(0, 3);

        console.log('STEP 2 | newestLikesRaw:', newestLikesRaw.map(l => ({ userId: l.userId, createdAt: l.createdAt })));


        // добавляем логины из users
        const newestLikes = [];
        for (const like of newestLikesRaw) {
            const user = await userRepository.findById(like.userId);
            console.log('STEP 3 | found user for like:', {
                userId: like.userId.toString(),
                login: user?.accountData.login,
            });
            newestLikes.push({
                addedAt: like.createdAt,
                userId: like.userId.toString(),
                login: user?.accountData.login ?? "unknown",
            });
        }

        const likesExtended = {
            likesCount,
            dislikesCount,
            myStatus,
            newestLikes,
        };

        return likesExtended;
    },






    // LIKES FOR COMMENTS
    async findLike(commentId: string, userId: string) {
        return likesRepository.findOne(commentId, userId);
    },

    async createLike(commentId: string, userId: string, status: LikeStatus) {
        const like = await likesRepository.create({
            commentId,
            userId,
            myStatus: status,
            createdAt: new Date().toISOString(),
        });
        return like;
    },

    async updateLike(commentId: string, userId: string, status: LikeStatus) {
        await likesRepository.update(commentId, userId, {myStatus: status});
    },

    async deleteLike(commentId: string, userId: string) {
        await likesRepository.delete(commentId, userId);
    },
};
