import {Request, Response} from "express";
import {commentsQwRepository} from "../../repositories/commentsQwRepository";

export async function getCommentHandler  (req: Request, res: Response)
:Promise<void> {

    try {

        const {id} = req.params;
        const comment = await commentsQwRepository.findById(id);

        if(!comment){
             res.sendStatus(404).send({message: 'Comment not found'});
            return
        }
        res.status(200).send(comment);

    }

    catch (e: unknown) {

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