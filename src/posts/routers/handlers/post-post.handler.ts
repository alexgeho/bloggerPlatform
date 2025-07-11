// import { Request, Response } from 'express';
// import { HttpStatus } from '../../../core/types/http-statuses';
// import { errorsHandler } from '../../../core/errors/errors.handler';
// import {blogsService} from "../../application/blogs.service";
//
// export async function postPostHandler(req: Request, res: Response) {
//     try {
//         // req.body напрямую!
//         const createdBlogData = await blogsService.create(req.body);
//
//         res.status(HttpStatus.Created).send(createdBlogData);
//     } catch (e) {
//         errorsHandler(e, res);
//     }
// }
//
