import {Request, Response} from "express";
import {commentsQwRepository} from "../../repositories/commentsQwRepository";

export async function getCommentHandler(req: Request, res: Response)
    : Promise<void> {

    try {

        const {id} = req.params;
        const comment = await commentsQwRepository.findById(id);

        if (!comment) {
            res.sendStatus(404).send({message: 'Comment not found'});
            return
        }

        const viewModel = {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt

        }


        res.status(200).send(viewModel);

    } catch (e: unknown) {

    }

}


// => {
//
//     const {id} = req.params;
//
//     const comment = await commentsQwRepository.findById(id);
//
//     if(!comment){
//
//         return res.sendStatus(404).send({message: 'Comment not found'});
//     }
//
//     res.status(200).send(comment);
//
//
//
//
// }