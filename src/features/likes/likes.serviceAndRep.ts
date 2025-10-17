import {LikeStatus} from "./domain/like-status.enum";
import {userRepository, userService} from "../../composition-root";
import {LikeForPostDocument} from "./domain/like-for-post";
import {likesForPostsRepository} from "./repository/likes-for-posts.repository";
import {likesForCommentsRepository} from "./repository/likes-for-comments.repository";

export const likesService = {

    // LIKES FOR POSTS

    async createLikeOnPost(postId: string, userId: string, likeStatus: string) {
        const existingLike = await likesForPostsRepository.findOne(postId, userId);

        // 🔹 1. Если лайка нет — создаём, но только если статус не "None"
        if (!existingLike) {
            if (likeStatus === LikeStatus.None) return; // ничего не делаем
            await likesForPostsRepository.create(postId, userId, likeStatus);
            return;
        }

        // 🔹 2. Если лайк уже есть и статус не меняется — ничего не делаем
        if (existingLike.myStatus === likeStatus) {
            return;
        }

        // 🔹 3. Если новый статус "None" — удаляем лайк
        if (likeStatus === LikeStatus.None) {
            await likesForPostsRepository.delete(postId, userId);
            return;
        }

        // 🔹 4. Иначе обновляем статус (Like ↔ Dislike)
        await likesForPostsRepository.update(postId, userId, { myStatus: likeStatus });
    },

    async findAllLikesOnPost(postId: string, userId?: string) {

        const likes: LikeForPostDocument[] = await likesForPostsRepository.findManyByPost(postId);


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



        // добавляем логины из users
        const newestLikes = [];
        for (const like of newestLikesRaw) {
            const user = await userRepository.findById(like.userId);

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
        return likesForCommentsRepository.findOne(commentId, userId);
    },

    async createLike(commentId: string, userId: string, status: LikeStatus) {
        const like = await likesForCommentsRepository.create({
            commentId,
            userId,
            myStatus: status,
            createdAt: new Date().toISOString(),
        });
        return like;
    },

    async updateLike(commentId: string, userId: string, status: LikeStatus) {
        await likesForCommentsRepository.update(commentId, userId, {myStatus: status});
    },

    async deleteLike(commentId: string, userId: string) {
        await likesForCommentsRepository.delete(commentId, userId);
    },
};
