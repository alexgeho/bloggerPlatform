import {Request, Response} from "express";
import {postsService} from "../posts/application/posts.service";


export async function likeToPostHandler(req: Request, res: Response)
    : Promise<void> {
    try {
        const userId = req.user!.userId;
        const postId = req.params.id;
        const likeStatus = req.body.likeStatus;

        await postsService.updateLikeOnPost(postId, userId, likeStatus);

        res.sendStatus(204);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }


}