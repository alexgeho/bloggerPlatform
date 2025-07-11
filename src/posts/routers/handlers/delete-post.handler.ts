// import { Request, Response } from 'express';
// import { HttpStatus } from '../../../core/types/http-statuses';
// import { postsRepository } from '../../repositories/posts.repository';
// import { createErrorMessages } from '../../../core/middlewares/validation/input-validtion-result.middleware';
//
// export async function deletePostHandler(req: Request, res: Response) {
//     try {
//         const id = req.params.id;
//         const driver = await postsRepository.findById(id);
//
//         if (!driver) {
//             res
//                 .status(HttpStatus.NotFound)
//                 .send(
//                     createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
//                 );
//             return;
//         }
//
//
//
//         await postsRepository.delete(id);
//         res.sendStatus(HttpStatus.NoContent);
//     } catch (e: unknown) {
//         res.sendStatus(HttpStatus.InternalServerError);
//     }
// }
