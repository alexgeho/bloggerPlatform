import {Request, Response} from "express";
import {commentsQwRepository} from "../../repositories/commentsQwRepository";


export async function getCommentHandler(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = req.user?.userId; // получаем userId, если пользователь авторизован

        // 🧠 теперь findById принимает userId и возвращает уже с myStatus
        const comment = await commentsQwRepository.findById(id, userId);

        if (!comment) {
            res.status(404).send({ message: 'Comment not found' });
            return;
        }

        const viewModel = {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus, // 👈 вот тут ты используешь присвоенное значение
            },
        };

        res.status(200).send(viewModel);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}