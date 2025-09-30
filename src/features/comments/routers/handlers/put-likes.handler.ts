import {Request, Response} from "express";
import {commentsService} from "../../application/comments.service";


export async function putLikesHandler(
    req: Request,
    res: Response
): Promise<void> {

    const userId = req.user!.userId; // из accessToken
    const commentId = req.params.commentId;
    const { likeStatus } = req.body;

    if (!["None", "Like", "Dislike"].includes(likeStatus)) {
         res.status(400).send({ error: "Invalid like status" })
        return;
    }

    try {
        await commentsService.setLikeStatus(commentId, userId, likeStatus);
         res.sendStatus(204)
        return;
    } catch (e) {
         res.sendStatus(404)
        return;
    }}