import express from "express";
import {Request, Response} from "express";
import {CommentUpdateInput} from "../../../posts/routers/input/post-update.input";
import {commentsService} from "../../application/comments.service";
import {ResultStatus} from "../../../auth/common/result/resultCode";
import {resultCodeToHttpException} from "../../../auth/common/result/resultCodeToHttpException";
import {commentsQwRepository} from "../../repositories/commentsQwRepository";




export async function putCommentsHandler(
    req: Request<{ id: string }, {}, CommentUpdateInput>,
    res: Response
): Promise<void> {
    const { id } = req.params;
    const { content } = req.body;


    const comment = await commentsQwRepository.findById(id);

    if (!comment){
        res.sendStatus(404);
        return;
    }


    if (comment.commentatorInfo.userId !== req.user.userId) {
    res.status(403).json({})
    }


    const result = await commentsService.updateComment(id, content);

    if (result.status !== ResultStatus.Success) {
        res.status(resultCodeToHttpException(result.status)).send(result.extensions);
        return;
    }

    res.sendStatus(204); // OK
}
