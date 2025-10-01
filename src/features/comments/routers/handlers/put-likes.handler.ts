import { Request, Response } from "express";
import { commentsService } from "../../application/comments.service";

export async function putLikesHandler(req: Request, res: Response): Promise<void> {

    try {
        const userId = req.user.userId; // из accessToken
        const commentId = req.params.id;
        const likeStatus = req.body.likeStatus;


       // проверка ID
        if (!commentId) {
            res.status(404).send({ error: "Invalid comment id" });
            return;
        }
        console.log('commentId:', commentId)
        console.log('userId:', userId )
        console.log('likeStatus:', likeStatus)


        // валидация статуса
        if (!["None", "Like", "Dislike"].includes(likeStatus)) {
            res.status(400).send({ error: "Invalid like status" });
            return;
        }

        // бизнес-логика
        const setLikeStatus = await commentsService.setLikeStatus(commentId, userId, likeStatus);

        if (setLikeStatus === "COMMENT_NOT_FOUND") {
            res.status(404).send({error:"Comment not found"}); // комментарий не найден
            return;
        }

        if (setLikeStatus === "USER_NOT_FOUND") {
            res.status(404).send({error:"User not found"}); // комментарий не найден
            return;
        }

        res.sendStatus(204); // успех
    } catch (e) {
        console.error("Error in putLikesHandler:", e);
        res.sendStatus(500); // внутренняя ошибка сервера
    }
}
