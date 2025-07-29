import express, {response} from "express";
import {Request, Response} from "express";
import {CommentUpdateInput} from "../../../posts/routers/input/post-update.input";
import {commentsService} from "../../application/comments.service";
import {ResultStatus} from "../../../auth/common/result/resultCode";
import {resultCodeToHttpException} from "../../../auth/common/result/resultCodeToHttpException";
import {commentsQwRepository} from "../../comments.repository";

async const getCommentHandler = async (
    req: Request,
    res: Response
) => {

    const {id} = req.params;

    const comment = await commentsQwRepository.findById(id);

    if(!comment){

        return res.sendStatus(404).send({message: 'Comment not found'});
    }

    res.status(200).send(comment);

}




)